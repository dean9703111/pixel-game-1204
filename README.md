# 🎮 Pixel Quiz Game

像素風格闖關問答遊戲，使用 React + Google Sheets 打造的復古街機風格答題挑戰！

![Demo](https://api.dicebear.com/7.x/pixel-art/svg?seed=pixel-quiz&backgroundColor=transparent&size=100)

---

## 📋 目錄

- [功能特色](#功能特色)
- [快速開始](#快速開始)
- [環境變數設定](#環境變數設定)
- [Google Sheets 設定](#google-sheets-設定)
- [Google Apps Script 部署](#google-apps-script-部署)
- [測試題目範本](#測試題目範本)
- [常見問題](#常見問題)

---

## ✨ 功能特色

- 🕹️ 復古像素風 UI（Press Start 2P 字體 + CRT 掃描線效果）
- 👾 每一關配有 DiceBear 隨機關主頭像
- 📊 成績自動記錄到 Google Sheets
- 🔄 支援重複遊玩，追蹤最高分與通關次數

---

## 🚀 快速開始

### 1. 安裝依賴

```bash
cd pixel-game-1204
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

```env
# Google Apps Script 部署後的網址
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/你的部署ID/exec

# 通過門檻（需答對幾題才算通關）
VITE_PASS_THRESHOLD=7

# 每次遊戲的題目數量
VITE_QUESTION_COUNT=10
```

---

## 📝 Google Sheets 設定

### 步驟 1：建立新的 Google Sheets

1. 前往 [Google Sheets](https://sheets.google.com)
2. 點擊「空白」建立新試算表
3. 將檔案命名為「Pixel Quiz Game」

### 步驟 2：建立「題目」工作表

1. 將第一個工作表(Sheet)重新命名為 `題目`
2. 在第一列建立以下標題：

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| 題號 | 題目 | A | B | C | D | 解答 |

3. 從第二列開始輸入題目資料（見下方[測試題目範本](#測試題目範本)）

### 步驟 3：建立「回答」工作表

1. 點擊左下角的「+」新增工作表
2. 將新工作表命名為 `回答`
3. 在第一列建立以下標題：

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| ID | 闘關次數 | 總分 | 最高分 | 第一次通關分數 | 花了幾次通關 | 最近遊玩時間 |

> ⚠️ 「回答」工作表的資料會由系統自動寫入，不需要手動填寫

---

## 🔧 Google Apps Script 部署

### 步驟 1：開啟 Apps Script 編輯器

1. 在你的 Google Sheets 中，點擊選單列的「擴充功能」
2. 選擇「Apps Script」

![開啟 Apps Script](https://i.imgur.com/example1.png)

### 步驟 2：貼上程式碼

1. 刪除預設的 `function myFunction() {}` 內容
2. 複製 `gas/Code.gs` 的全部內容並貼上
3. 按 `Ctrl + S` 儲存

### 步驟 3：部署為網頁應用程式

1. 點擊右上角的「部署」按鈕
2. 選擇「新增部署」
3. 點擊「選取類型」旁的齒輪圖示，選擇「網頁應用程式」
4. 設定以下選項：

   | 設定項目 | 值 |
   |---------|---|
   | 說明 | Pixel Quiz API |
   | 執行身分 | 我 (你的信箱) |
   | 誰可以存取 | **所有人** |

5. 點擊「部署」
6. 首次部署會要求授權，點擊「授予權限」
7. 選擇你的 Google 帳號
8. 如果出現「這個應用程式未經驗證」，點擊「進階」→「前往 Pixel Quiz API（不安全）」
9. 點擊「允許」

### 步驟 4：複製部署網址

1. 部署成功後會顯示「網頁應用程式」的網址
2. 複製該網址（格式如：`https://script.google.com/macros/s/AKfyc.../exec`）
3. 將網址貼到 `.env` 檔案的 `VITE_GOOGLE_APP_SCRIPT_URL`

### 步驟 5：重新啟動開發伺服器

```bash
# 按 Ctrl + C 停止目前的伺服器
npm run dev
```

---

## 📚 測試題目範本

以下是 10 題「生成式 AI 基礎知識」選擇題，可直接複製貼上到 Google Sheets：

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

### 如何貼到 Google Sheets

1. 複製上方表格內容
2. 在 Google Sheets 的「題目」工作表中，點擊 A2 儲存格
3. 按 `Ctrl + V` 貼上
4. 如果格式不正確，可以使用「資料」→「將文字分割成欄」功能

---

## ❓ 常見問題

### Q: 遊戲顯示「載入題目失敗」

- 確認 `.env` 的 `VITE_GOOGLE_APP_SCRIPT_URL` 是否正確
- 確認 Apps Script 已部署且設定為「所有人」可存取
- 確認「題目」工作表名稱正確（不要有空格）

### Q: 成績沒有記錄到 Google Sheets

- 確認「回答」工作表已建立且名稱正確
- 在 Apps Script 重新部署一次（部署 → 管理部署 → 編輯 → 部署）

### Q: 如何修改通過門檻？

修改 `.env` 的 `VITE_PASS_THRESHOLD` 值，然後重新啟動伺服器

### Q: 如何新增更多題目？

直接在 Google Sheets 的「題目」工作表新增列即可，系統會自動抓取

---

## 📁 專案結構

```
pixel-game-1204/
├── .env                    # 環境變數設定
├── src/
│   ├── App.jsx             # 路由設定
│   ├── pages/
│   │   ├── HomePage.jsx    # 首頁（ID 輸入）
│   │   ├── GamePage.jsx    # 遊戲頁（答題）
│   │   └── ResultPage.jsx  # 結果頁（成績）
│   ├── services/
│   │   └── api.js          # API 整合
│   ├── utils/
│   │   └── avatarLoader.js # 頭像載入
│   └── styles/
│       └── pixel.css       # 像素風樣式
└── gas/
    └── Code.gs             # Apps Script 程式碼
```

---

## 📄 License

MIT License
