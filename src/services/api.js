// API 服務 - Google Apps Script 整合

const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
const QUESTION_COUNT = parseInt(import.meta.env.VITE_QUESTION_COUNT) || 10;

/**
 * 從 Google Apps Script 取得隨機題目（不含答案）
 * @returns {Promise<Array>} 題目陣列
 */
export const fetchQuestions = async () => {
    try {
        const url = `${GAS_URL}?action=getQuestions&count=${QUESTION_COUNT}`;

        const response = await fetch(url, {
            method: 'GET',
            redirect: 'follow',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        return data.questions || [];
    } catch (error) {
        console.error('❌ 取得題目失敗:', error);
        throw error;
    }
};

/**
 * 提交答案到 Google Apps Script 計算成績
 * @param {string} userId - 使用者 ID
 * @param {Array} answers - 答案陣列 [{questionId, selected}, ...]
 * @returns {Promise<Object>} 包含成績和每題正確答案
 */
export const submitScore = async (userId, answers) => {
    try {
        const payload = JSON.stringify({
            action: 'submitScore',
            userId,
            answers,
            timestamp: new Date().toISOString(),
        });

        const response = await fetch(GAS_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: payload,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        return data;
    } catch (error) {
        console.error('❌ 提交成績失敗:', error);
        throw error;
    }
};

/**
 * 取得使用者歷史紀錄
 * @param {string} userId - 使用者 ID
 * @returns {Promise<Object>} 使用者紀錄
 */
export const getUserHistory = async (userId) => {
    try {
        const response = await fetch(
            `${GAS_URL}?action=getUserHistory&userId=${encodeURIComponent(userId)}`,
            {
                method: 'GET',
                redirect: 'follow',
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ 取得歷史紀錄失敗:', error);
        return null;
    }
};

export default {
    fetchQuestions,
    submitScore,
    getUserHistory,
};
