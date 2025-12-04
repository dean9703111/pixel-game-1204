# 🎮 Pixel Quiz Game

像素風格闘關問答遊戲，使用 React + Google Sheets 打造的復古街機風格答題挑戰！

![Demo](https://api.dicebear.com/7.x/pixel-art/svg?seed=pixel-quiz&backgroundColor=transparent&size=100)

---

## 📋 目錄

- [功能特色](#功能特色)
- [快速開始](#快速開始)
- [環境變數設定](#環境變數設定)
- [Google Sheets 設定](#google-sheets-設定)
- [Google Apps Script 部署](#google-apps-script-部署)
- [GitHub Pages 部署](#github-pages-部署)
- [測試題目範本](#測試題目範本)
- [常見問題](#常見問題)

---

## ✨ 功能特色

- 🕹️ 復古像素風 UI（Press Start 2P 字體 + CRT 掃描線效果）
- 👾 每一關配有 DiceBear 隨機關主頭像
- 📊 成績自動記錄到 Google Sheets
- 🔄 支援重複遊玩，追蹤最高分與通關次數
- 🚀 支援 GitHub Pages 自動部署

---

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

```bash
cp .env.example .env
# 編輯 .env 填入你的 Google Apps Script URL
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問 http://localhost:5173

---

## ⚙️ 環境變數設定

編輯 `.env` 檔案：

| 變數名稱 | 說明 | 預設值 |
|---------|------|--------|
| `VITE_GOOGLE_APP_SCRIPT_URL` | GAS 部署網址 | 必填 |
| `VITE_PASS_THRESHOLD` | 通過門檻（答對幾題） | 7 |
| `VITE_QUESTION_COUNT` | 每次題目數量 | 10 |

---

## 📝 Google Sheets 設定

### 步驟 1：建立 Google Sheets

1. 前往 [Google Sheets](https://sheets.google.com) 建立新試算表
2. 命名為「Pixel Quiz Game」

### 步驟 2：建立「題目」工作表

在第一列建立標題：

| 題號 | 題目 | A | B | C | D | 解答 |
|------|------|---|---|---|---|------|

### 步驟 3：建立「回答」工作表

新增工作表，在第一列建立標題：

| ID | 闘關次數 | 總分 | 最高分 | 第一次通關分數 | 花了幾次通關 | 最近遊玩時間 |
|----|----------|------|--------|----------------|--------------|--------------|

---

## 🔧 Google Apps Script 部署

### 步驟 1：開啟 Apps Script

在 Google Sheets 點擊「擴充功能」→「Apps Script」

### 步驟 2：貼上程式碼

複製 `gas/Code.gs` 內容並貼上，儲存

### 步驟 3：部署

1. 點擊「部署」→「新增部署」
2. 類型選擇「網頁應用程式」
3. 設定：
   - 執行身分：我
   - 誰可以存取：**所有人**
4. 點擊「部署」並授權
5. 複製網址到 `.env`

> ⚠️ 修改程式碼後需重新部署：「部署」→「管理部署」→「編輯」→ 版本選「新版本」→「部署」

---

## 🌐 GitHub Pages 部署

### 步驟 1：設定 Repository Secrets

在 GitHub Repository 設定以下 Secrets：

**Settings → Secrets and variables → Actions → New repository secret**

| 名稱 | 值 |
|------|-----|
| `VITE_GOOGLE_APP_SCRIPT_URL` | 你的 GAS 部署網址 |

### 步驟 2：設定 Variables（可選）

**Settings → Secrets and variables → Actions → Variables → New repository variable**

| 名稱 | 值 | 說明 |
|------|-----|------|
| `VITE_PASS_THRESHOLD` | 7 | 通過門檻 |
| `VITE_QUESTION_COUNT` | 10 | 題目數量 |

### 步驟 3：啟用 GitHub Pages

1. **Settings → Pages**
2. Source 選擇「GitHub Actions」

### 步驟 4：觸發部署

Push 到 `main` 分支即自動部署，或手動觸發：

**Actions → Deploy to GitHub Pages → Run workflow**

### 步驟 5：修改 base 路徑（如需要）

如果你的 repo 名稱不是 `pixel-game-1204`，請修改 `vite.config.js`：

```js
base: process.env.NODE_ENV === 'production' ? '/你的repo名稱/' : '/',
```

---

## 📚 測試題目範本

10 題「生成式 AI 基礎知識」選擇題：

| 題號 | 題目 | A | B | C | D | 解答 |
|------|------|---|---|---|---|------|
| 1 | ChatGPT 是由哪家公司開發的？ | Google | OpenAI | Meta | Microsoft | B |
| 2 | GPT 是什麼的縮寫？ | Generative Pre-trained Transformer | General Purpose Technology | Global Processing Tool | Graphic Processing Technology | A |
| 3 | 下列何者不是生成式 AI 的應用？ | 文字生成 | 圖片生成 | 資料庫查詢 | 音樂創作 | C |
| 4 | Transformer 模型最初是由哪家公司提出的？ | OpenAI | Google | Meta | Anthropic | B |
| 5 | LLM 代表什麼意思？ | Large Language Model | Learning Language Machine | Local Language Model | Limited Language Mode | A |
| 6 | 下列哪個是文字轉圖片的 AI 模型？ | GPT-4 | DALL-E | BERT | LLaMA | B |
| 7 | Prompt Engineering 的主要目的是什麼？ | 訓練模型 | 優化硬體 | 設計有效的提示詞 | 壓縮模型大小 | C |
| 8 | 什麼是「幻覺」(Hallucination) 在 AI 領域的意思？ | AI 產生虛假資訊 | AI 做夢 | AI 過熱 | AI 當機 | A |
| 9 | RAG 技術的全稱是什麼？ | Retrieval-Augmented Generation | Random Access Generation | Real-time AI Generation | Reinforcement-Augmented Growth | A |
| 10 | 下列哪個是 Google 開發的大型語言模型？ | GPT-4 | Claude | Gemini | LLaMA | C |

---

## ❓ 常見問題

### Q: 遊戲顯示「載入題目失敗」
- 確認 `.env` 的 GAS URL 正確
- 確認 Apps Script 已部署為「所有人」可存取

### Q: 成績沒有記錄
- 確認「回答」工作表已建立
- 重新部署 Apps Script（選新版本）

### Q: GitHub Pages 部署失敗
- 確認已設定 `VITE_GOOGLE_APP_SCRIPT_URL` Secret
- 確認 Pages Source 選擇「GitHub Actions」

---

## 📁 專案結構

```
pixel-game-1204/
├── .env.example            # 環境變數範本
├── .github/workflows/      # GitHub Actions
│   └── deploy.yml
├── src/
│   ├── pages/              # 頁面元件
│   ├── services/           # API 服務
│   ├── utils/              # 工具函式
│   └── styles/             # 樣式
└── gas/
    └── Code.gs             # Apps Script 程式碼
```

---

## 📄 License

MIT License
