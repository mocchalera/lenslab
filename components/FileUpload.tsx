import React, { useCallback, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const HEIC_MIME_TYPES = new Set(['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence']);
const MAX_CONVERTED_FILE_BYTES = 20 * 1024 * 1024;
const RESIZE_LONG_EDGE = 2048;
const JPEG_QUALITY = 0.92;

const isHeicFile = (file: File): boolean => {
  const mimeType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  return HEIC_MIME_TYPES.has(mimeType) || fileName.endsWith('.heic') || fileName.endsWith('.heif');
};

const toJpegFileName = (fileName: string): string => {
  const withoutExtension = fileName.replace(/\.(heic|heif)$/i, '');
  return `${withoutExtension || 'iphone-photo'}.jpg`;
};

const loadImageElement = (blob: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(blob);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to load converted image.'));
    };
    image.src = objectUrl;
  });
};

const resizeJpegIfNeeded = async (file: File): Promise<File> => {
  if (file.size <= MAX_CONVERTED_FILE_BYTES) {
    return file;
  }

  const image = await loadImageElement(file);
  const scale = Math.min(1, RESIZE_LONG_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    return file;
  }

  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY);
  });

  if (!blob) {
    return file;
  }

  return new File([blob], file.name, {
    type: 'image/jpeg',
    lastModified: file.lastModified,
  });
};

const convertHeicToJpeg = async (file: File): Promise<File> => {
  const { default: heic2any } = await import('heic2any');
  const converted = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: JPEG_QUALITY,
  });
  const blob = Array.isArray(converted) ? converted[0] : converted;

  if (!blob) {
    throw new Error('HEIC conversion returned no image.');
  }

  const jpegFile = new File([blob], toJpegFileName(file.name), {
    type: 'image/jpeg',
    lastModified: file.lastModified,
  });

  return resizeJpegIfNeeded(jpegFile);
};

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const { t } = useLanguage();
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setConversionError(null);

      if (!isHeicFile(file)) {
        onFileSelect(file);
        return;
      }

      setIsConverting(true);
      try {
        const convertedFile = await convertHeicToJpeg(file);
        onFileSelect(convertedFile);
      } catch (error) {
        console.error('HEIC conversion failed:', error);
        setConversionError(t('heicConvertFailed'));
      } finally {
        setIsConverting(false);
      }
    },
    [onFileSelect, t]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isConverting && e.dataTransfer.files && e.dataTransfer.files[0]) {
        void handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile, isConverting]
  );

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isConverting && e.target.files && e.target.files[0]) {
      void handleFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        htmlFor="dropzone-file"
        className={`relative flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-zinc-700 rounded-lg bg-zinc-900/50 transition-all duration-300 group ${
          isConverting
            ? 'cursor-wait opacity-90'
            : 'cursor-pointer hover:bg-zinc-800/50 hover:border-zinc-500'
        }`}
        aria-busy={isConverting}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-zinc-400 group-hover:text-zinc-200">
          <svg
            className="w-12 h-12 mb-4 transition-transform group-hover:scale-110 duration-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm font-medium">
            <span className="font-bold">{t('uploadClick')}</span>{t('uploadDrop')}
          </p>
          <p className="text-xs text-zinc-500">
            {t('uploadFormats')}
          </p>
        </div>

        {isConverting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-zinc-950/85 text-zinc-100">
            <div className="h-8 w-8 rounded-full border-2 border-zinc-600 border-t-blue-400 animate-spin" />
            <p className="text-sm font-semibold">{t('convertingHeic')}</p>
          </div>
        )}

        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept="image/*,.heic,.heif,image/heic,image/heif,image/heic-sequence,image/heif-sequence"
          onChange={handleChange}
          aria-label={t('uploadAria')}
          disabled={isConverting}
        />
      </label>

      {conversionError && (
        <p className="rounded border border-red-500/40 bg-red-950/30 px-3 py-2 text-sm text-red-200">
          {conversionError}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
