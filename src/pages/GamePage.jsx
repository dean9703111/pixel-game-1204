import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../services/api';
import { getAvatarByLevel } from '../utils/avatarLoader';
import '../styles/pixel.css';

const QUESTION_COUNT = parseInt(import.meta.env.VITE_QUESTION_COUNT) || 10;

const GamePage = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // 防止 StrictMode 重複呼叫
    const hasFetched = useRef(false);

    // Demo 題目
    const demoQuestions = [
        { id: 1, question: "HTML 代表什麼？", A: "Hyper Text Markup Language", B: "High Tech Modern Language", C: "Hyper Transfer Markup Language", D: "Home Tool Markup Language" },
        { id: 2, question: "CSS 主要用於？", A: "資料庫管理", B: "網頁樣式設計", C: "伺服器程式", D: "遊戲開發" },
        { id: 3, question: "JavaScript 是什麼類型的語言？", A: "編譯式語言", B: "直譯式語言", C: "組合語言", D: "機器語言" },
        { id: 4, question: "React 是由哪家公司開發的？", A: "Google", B: "Microsoft", C: "Meta (Facebook)", D: "Apple" },
        { id: 5, question: "Git 是用來做什麼的？", A: "版本控制", B: "網頁設計", C: "資料庫管理", D: "圖片編輯" },
    ];

    useEffect(() => {
        // 防止重複呼叫
        if (hasFetched.current) return;
        hasFetched.current = true;

        const loadQuestions = async () => {
            const userId = sessionStorage.getItem('userId');
            if (!userId) {
                navigate('/');
                return;
            }

            try {
                setIsLoading(true);
                const data = await fetchQuestions();

                if (data && data.length > 0) {
                    setQuestions(data);
                } else {
                    console.log('📝 使用 Demo 題目');
                    setQuestions(demoQuestions.slice(0, QUESTION_COUNT));
                }
            } catch (err) {
                console.error('載入題目失敗:', err);
                console.log('📝 API 連接失敗，使用 Demo 題目');
                setQuestions(demoQuestions.slice(0, QUESTION_COUNT));
            } finally {
                setIsLoading(false);
            }
        };

        loadQuestions();
    }, [navigate]);

    const currentQuestion = questions[currentIndex];
    const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

    const handleSelectAnswer = (option) => {
        if (selectedAnswer) return;
        setSelectedAnswer(option);
    };

    const handleNext = () => {
        if (!selectedAnswer) return;

        const newAnswers = [...answers, {
            questionId: currentQuestion.id,
            selected: selectedAnswer
        }];
        setAnswers(newAnswers);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
        } else {
            sessionStorage.setItem('userAnswers', JSON.stringify(newAnswers));
            sessionStorage.setItem('questionCount', questions.length.toString());
            navigate('/result');
        }
    };

    if (isLoading) {
        return (
            <div className="screen-container">
                <div className="scanlines"></div>
                <div className="pixel-box" style={{ textAlign: 'center' }}>
                    <p className="rainbow" style={{ fontSize: '14px' }}>載入題目中...</p>
                    <div className="bounce" style={{ fontSize: '24px', marginTop: '16px' }}>🎮</div>
                </div>
            </div>
        );
    }

    if (error || !currentQuestion) {
        return (
            <div className="screen-container">
                <div className="scanlines"></div>
                <div className="pixel-box" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--color-error)', fontSize: '12px' }}>❌ {error || '無法載入題目'}</p>
                    <button className="pixel-btn" onClick={() => navigate('/')} style={{ marginTop: '16px' }}>
                        返回首頁
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="screen-container" style={{ justifyContent: 'flex-start', paddingTop: '32px' }}>
            <div className="scanlines"></div>

            <div style={{ width: '100%', maxWidth: '600px' }}>
                <div className="level-indicator">
                    <span>LEVEL</span>
                    <span className="rainbow">{currentIndex + 1}</span>
                    <span>/</span>
                    <span>{questions.length}</span>
                </div>

                <div className="pixel-progress" style={{ marginTop: '12px' }}>
                    <div className="pixel-progress__bar" style={{ width: `${progress}%` }}></div>
                    <span className="pixel-progress__text">{Math.round(progress)}%</span>
                </div>
            </div>

            <div className="fade-in" style={{ textAlign: 'center', marginTop: '24px' }}>
                <div className="avatar-container" style={{ margin: '0 auto' }}>
                    <img src={getAvatarByLevel(currentIndex + 1)} alt={`關主 ${currentIndex + 1}`} />
                </div>
                <p style={{ fontSize: '10px', color: 'var(--color-warning)', marginTop: '8px' }}>
                    關主 #{currentIndex + 1}
                </p>
            </div>

            <div className="pixel-card fade-in" style={{ width: '100%', maxWidth: '600px', marginTop: '24px' }}>
                <div style={{ fontSize: '12px', lineHeight: '1.8', marginBottom: '24px', color: 'var(--color-text)' }}>
                    <span style={{ color: 'var(--color-accent)' }}>Q{currentIndex + 1}.</span> {currentQuestion.question}
                </div>

                <div>
                    {['A', 'B', 'C', 'D'].map((option) => (
                        <button
                            key={option}
                            className={`option-btn ${selectedAnswer === option ? 'option-btn--selected' : ''}`}
                            onClick={() => handleSelectAnswer(option)}
                        >
                            <span style={{ color: 'var(--color-warning)', marginRight: '8px' }}>{option}.</span>
                            {currentQuestion[option]}
                        </button>
                    ))}
                </div>

                {selectedAnswer && (
                    <div className="fade-in" style={{ textAlign: 'center', marginTop: '24px' }}>
                        <button className="pixel-btn pixel-btn--accent" onClick={handleNext}>
                            {currentIndex < questions.length - 1 ? '確認，下一題 ▶' : '提交答案 ★'}
                        </button>
                    </div>
                )}
            </div>

            <div style={{ position: 'fixed', bottom: '16px', right: '16px', fontSize: '10px', color: 'var(--color-text-dim)' }}>
                已回答：{answers.length} / {questions.length}
            </div>
        </div>
    );
};

export default GamePage;
