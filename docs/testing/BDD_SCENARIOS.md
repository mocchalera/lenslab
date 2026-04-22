# BDD Scenarios

## Writing rules

- Write from user/business perspective.
- Use Given/When/Then.
- One scenario, one expected behavior.
- Keep setup minimal and explicit.
- Mark current implementation state at the start of each scenario with `[DONE]` or `[PLANNED]`.

## Scenarios

### [PLANNED] Scenario: 初回訪問者がプロバイダ切替で OpenAI を使って画像生成できる

- Given: 初回訪問者が LensLab を開き、画像生成に必要な入力欄が表示されている。
- And: Vercel Functions 側に OpenAI 用のサーバーサイド API key が設定されている。
- When: ユーザーが provider selector で OpenAI を選び、シミュレーション条件を入力して生成を実行する。
- Then: ブラウザは `gpt-image-2` への直接通信を行わず、API proxy 経由で画像生成リクエストを送る。
- And: 生成が成功した場合、OpenAI 由来の画像と利用した provider 表示が UI に出る。
- Notes: PR #1 / Phase A で導入中の主要導線。実装が main に入った後、Playwright E2E で回帰固定する。

### [PLANNED] Scenario: プロンプトを表示アコーディオンで最終プロンプトを確認できる

- Given: ユーザーが光学シミュレーションの入力を完了している。
- And: LensLab が provider に送る最終プロンプトを構築済みである。
- When: ユーザーがプロンプト表示アコーディオンを開く。
- Then: provider に送信される最終プロンプトが省略されずに確認できる。
- And: API key、環境変数、内部トークンなどの秘密情報は表示されない。
- Notes: PR #1 / Phase B で導入中の debug/inspection 導線。prompt builder の unit test と UI E2E で固定する。

### [PLANNED] Scenario: OpenAI API 失敗時に構造化エラーが UI に出る

- Given: ユーザーが OpenAI provider を選択して画像生成を実行している。
- And: Vercel Function から OpenAI API への呼び出しが失敗する。
- When: API proxy が失敗を受け取り、UI が応答を処理する。
- Then: UI には失敗理由を示す構造化エラーが表示される。
- And: provider の生レスポンス、API key、`process.env` の値は画面や client bundle に露出しない。
- Notes: PR #1 / Phase C で導入中の resilience 導線。API proxy の integration test で error code と HTTP status を固定する。

### [PLANNED] Scenario: 地図シーン (将来導入) で任意地点を選んで生成できる

- Given: ユーザーが地図シーン生成モードを開いている。
- And: 地図上で地点を選択できる状態である。
- When: ユーザーが任意地点を選び、光学シミュレーションの生成を実行する。
- Then: 選択地点の地理的文脈が最終プロンプトへ反映される。
- And: 生成結果は選択地点に対応するシーンとして表示される。
- Notes: 将来導入機能。地図操作は Playwright、地点から prompt への変換は unit test で固定する。

### [PLANNED] Scenario: 着せ替え UI (将来導入) でテーマ別タブから服装を選択できる

- Given: ユーザーが着せ替え UI を開いている。
- And: テーマ別タブに服装候補が分類されている。
- When: ユーザーがテーマタブを切り替え、服装を選択して生成を実行する。
- Then: 選択したテーマと服装が最終プロンプトに反映される。
- And: 生成結果の履歴には選択したテーマと provider が追跡できる形で残る。
- Notes: 将来導入機能。タブ選択状態は unit test、主要導線は E2E で確認する。
