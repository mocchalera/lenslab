import React, { useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onFileSelect(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <label
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      htmlFor="dropzone-file"
      className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer bg-zinc-900/50 hover:bg-zinc-800/50 hover:border-zinc-500 transition-all duration-300 group"
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
          <span className="font-bold">クリックしてアップロード</span>、またはドラッグ&ドロップ
        </p>
        <p className="text-xs text-zinc-500">
          HEIC / JPG / PNG（最大10MB）
        </p>
      </div>
      <input
        id="dropzone-file"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
        aria-label="元画像を選択"
      />
    </label>
  );
};

export default FileUpload;
