/**
 * Pixel Quiz Game - Google Apps Script 後端
 * 
 * 部署方式：
 * 1. 在 Google Sheets 中點選「擴充功能」>「Apps Script」
 * 2. 將此程式碼貼入 Code.gs
 * 3. 點選「部署」>「新增部署」
 * 4. 選擇「網頁應用程式」
 * 5. 設定「誰可以存取」為「所有人」
 * 6. 部署後複製網址，貼到 .env 的 VITE_GOOGLE_APP_SCRIPT_URL
 * 
 * ⚠️ 重要：每次修改程式碼後，需要「部署」>「管理部署」>「編輯」>「版本」選新版本 > 部署
 */

// ============ 設定區 ============
const QUESTIONS_SHEET_NAME = '題目';
const ANSWERS_SHEET_NAME = '回答';
// ================================

/**
 * 處理 GET 請求
 */
function doGet(e) {
  const params = e.parameter;
  const action = params.action;
  
  let result;
  
  try {
    switch (action) {
      case 'getQuestions':
        const count = parseInt(params.count) || 10;
        result = getRandomQuestions(count);
        break;
      case 'getUserHistory':
        const userId = params.userId;
        result = getUserHistory(userId);
        break;
      default:
        result = { error: 'Unknown action' };
    }
  } catch (error) {
    result = { error: error.message };
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 處理 POST 請求
 */
function doPost(e) {
  let result;
  
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      case 'submitScore':
        result = calculateAndRecordScore(data.userId, data.answers);
        break;
      default:
        result = { error: 'Unknown action' };
    }
  } catch (error) {
    result = { error: error.message };
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 隨機取得題目（不包含答案）
 * @param {number} count - 題目數量
 * @returns {Object} 題目陣列
 */
function getRandomQuestions(count) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(QUESTIONS_SHEET_NAME);
  
  if (!sheet) {
    throw new Error(`找不到「${QUESTIONS_SHEET_NAME}」工作表`);
  }
  
  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1).filter(row => row[0]); // 移除標題和空白列
  
  // 隨機打亂
  const shuffled = rows.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, rows.length));
  
  // 轉換為物件格式（不包含答案！）
  const questions = selected.map(row => ({
    id: row[0],
    question: row[1],
    A: row[2],
    B: row[3],
    C: row[4],
    D: row[5]
    // 注意：不回傳 answer
  }));
  
  return { questions };
}

/**
 * 計算成績並記錄
 * @param {string} userId - 使用者 ID
 * @param {Array} userAnswers - 使用者的答案 [{questionId, selected}, ...]
 * @returns {Object} 結果，包含每題的正確答案和選項文字
 */
function calculateAndRecordScore(userId, userAnswers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const questionsSheet = ss.getSheetByName(QUESTIONS_SHEET_NAME);
  
  if (!questionsSheet) {
    throw new Error(`找不到「${QUESTIONS_SHEET_NAME}」工作表`);
  }
  
  // 取得所有題目及答案（含選項內容）
  const data = questionsSheet.getDataRange().getValues();
  const answerMap = {};
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      answerMap[data[i][0]] = {
        question: data[i][1],
        A: data[i][2],
        B: data[i][3],
        C: data[i][4],
        D: data[i][5],
        correctAnswer: data[i][6] // G 欄是解答
      };
    }
  }
  
  // 計算每題結果（包含選項文字）
  let score = 0;
  const results = userAnswers.map(ua => {
    const questionData = answerMap[ua.questionId];
    if (!questionData) {
      return {
        questionId: ua.questionId,
        selected: ua.selected,
        selectedText: ua.selected,
        correctAnswer: '?',
        correctAnswerText: '?',
        isCorrect: false
      };
    }
    
    const isCorrect = ua.selected === questionData.correctAnswer;
    if (isCorrect) score++;
    
    return {
      questionId: ua.questionId,
      question: questionData.question,
      selected: ua.selected,
      selectedText: questionData[ua.selected] || ua.selected,
      correctAnswer: questionData.correctAnswer,
      correctAnswerText: questionData[questionData.correctAnswer] || questionData.correctAnswer,
      isCorrect
    };
  });
  
  const total = userAnswers.length;
  const passThreshold = 7;
  const passed = score >= passThreshold;
  
  // 記錄到回答工作表
  recordScore(userId, score, passed);
  
  return {
    success: true,
    userId,
    score,
    total,
    passed,
    passThreshold,
    results
  };
}

/**
 * 記錄成績到回答工作表
 */
function recordScore(userId, score, passed) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(ANSWERS_SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(ANSWERS_SHEET_NAME);
    sheet.appendRow(['ID', '闖關次數', '總分', '最高分', '第一次通關分數', '花了幾次通關', '最近遊玩時間']);
  }
  
  const data = sheet.getDataRange().getValues();
  
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      rowIndex = i + 1;
      break;
    }
  }
  
  const now = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
  
  if (rowIndex === -1) {
    sheet.appendRow([
      userId,
      1,
      score,
      score,
      passed ? score : '',
      passed ? 1 : '',
      now
    ]);
  } else {
    const existingRow = data[rowIndex - 1];
    const attempts = existingRow[1] + 1;
    const totalScore = existingRow[2] + score;
    const highScore = Math.max(existingRow[3], score);
    let firstPassScore = existingRow[4];
    let attemptsToPass = existingRow[5];
    
    if (passed && !firstPassScore) {
      firstPassScore = score;
      attemptsToPass = attempts;
    }
    
    sheet.getRange(rowIndex, 2).setValue(attempts);
    sheet.getRange(rowIndex, 3).setValue(totalScore);
    sheet.getRange(rowIndex, 4).setValue(highScore);
    sheet.getRange(rowIndex, 5).setValue(firstPassScore);
    sheet.getRange(rowIndex, 6).setValue(attemptsToPass);
    sheet.getRange(rowIndex, 7).setValue(now);
  }
}

/**
 * 取得使用者歷史紀錄
 */
function getUserHistory(userId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ANSWERS_SHEET_NAME);
  
  if (!sheet) {
    return { found: false };
  }
  
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      return {
        found: true,
        userId: data[i][0],
        attempts: data[i][1],
        totalScore: data[i][2],
        highScore: data[i][3],
        firstPassScore: data[i][4],
        attemptsToPass: data[i][5],
        lastPlayed: data[i][6]
      };
    }
  }
  
  return { found: false };
}
