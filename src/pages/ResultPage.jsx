import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitScore } from '../services/api';
import { getRandomAvatar } from '../utils/avatarLoader';
import '../styles/pixel.css';

const ResultPage = () => {
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(true);
    const [submitError, setSubmitError] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    // 防止 StrictMode 和刷新重複提交
    const hasSubmitted = useRef(false);

    useEffect(() => {
        // 防止重複提交
        if (hasSubmitted.current) return;

        const submitAnswers = async () => {
            const userAnswers = sessionStorage.getItem('userAnswers');
            const userId = sessionStorage.getItem('userId');

            if (!userAnswers || !userId) {
                navigate('/');
                return;
            }

            // 標記已提交，防止重複
            hasSubmitted.current = true;

            try {
                setIsSubmitting(true);
                const answers = JSON.parse(userAnswers);

                // 送到 GAS 計算成績
                const data = await submitScore(userId, answers);

                if (data.success) {
                    // 成功後清除答案，防止刷新重複提交
                    sessionStorage.removeItem('userAnswers');

                    // 儲存結果供刷新時使用
                    sessionStorage.setItem('lastResult', JSON.stringify(data));

                    setResult(data);
                    if (data.passed) {
                        setShowConfetti(true);
                    }
                } else {
                    setSubmitError(data.error || '提交失敗');
                    hasSubmitted.current = false; // 失敗可以重試
                }
            } catch (err) {
                console.error('提交成績失敗:', err);
                setSubmitError('無法連接伺服器，請稍後再試');
                hasSubmitted.current = false; // 失敗可以重試
            } finally {
                setIsSubmitting(false);
            }
        };

        // 檢查是否有上次的結果（刷新頁面時使用）
        const lastResult = sessionStorage.getItem('lastResult');
        if (lastResult && !sessionStorage.getItem('userAnswers')) {
            hasSubmitted.current = true;
            setResult(JSON.parse(lastResult));
            setIsSubmitting(false);
            if (JSON.parse(lastResult).passed) {
                setShowConfetti(true);
            }
            return;
        }

        submitAnswers();
    }, [navigate]);

    const handlePlayAgain = () => {
        sessionStorage.removeItem('userAnswers');
        sessionStorage.removeItem('questionCount');
        sessionStorage.removeItem('lastResult');
        navigate('/game');
    };

    const handleBackHome = () => {
        sessionStorage.clear();
        navigate('/');
    };

    if (isSubmitting) {
        return (
            <div className="screen-container">
                <div className="scanlines"></div>
                <div className="pixel-box" style={{ textAlign: 'center' }}>
                    <p className="rainbow" style={{ fontSize: '14px' }}>計算成績中...</p>
                    <div className="bounce" style={{ fontSize: '24px', marginTop: '16px' }}>📊</div>
                </div>
            </div>
        );
    }

    if (submitError) {
        return (
            <div className="screen-container">
                <div className="scanlines"></div>
                <div className="pixel-box" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--color-error)', fontSize: '12px' }}>❌ {submitError}</p>
                    <button className="pixel-btn" onClick={handleBackHome} style={{ marginTop: '16px' }}>
                        返回首頁
                    </button>
                </div>
            </div>
        );
    }

    if (!result) {
        return null;
    }

    const { score, total, passed, passThreshold, userId, results } = result;
    const percentage = Math.round((score / total) * 100);

    return (
        <div className="screen-container" style={{ justifyContent: 'flex-start', paddingTop: '32px' }}>
            <div className="scanlines"></div>

            {showConfetti && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    overflow: 'hidden',
                    zIndex: 100
                }}>
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                top: '-20px',
                                left: `${Math.random() * 100}%`,
                                width: '10px',
                                height: '10px',
                                background: ['#ff0', '#0ff', '#f0f', '#0f0', '#f00'][Math.floor(Math.random() * 5)],
                                animation: `confetti ${2 + Math.random() * 2}s linear forwards`,
                                animationDelay: `${Math.random() * 0.5}s`,
                            }}
                        />
                    ))}
                    <style>{`
            @keyframes confetti {
              to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
              }
            }
          `}</style>
                </div>
            )}

            <div className="fade-in">
                <div className="avatar-container" style={{
                    margin: '0 auto',
                    width: '120px',
                    height: '120px',
                    borderColor: passed ? 'var(--color-success)' : 'var(--color-error)'
                }}>
                    <img src={getRandomAvatar()} alt="結果" />
                </div>
            </div>

            <div className="fade-in" style={{ textAlign: 'center', animationDelay: '0.2s' }}>
                <h1 className={`pixel-title pixel-title--large ${passed ? 'result-pass' : 'result-fail'}`}>
                    {passed ? '🎉 通關成功！' : '💀 挑戰失敗'}
                </h1>
                <p style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginTop: '8px' }}>
                    玩家：{userId}
                </p>
            </div>

            <div className="pixel-card fade-in" style={{
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                animationDelay: '0.4s'
            }}>
                <p style={{ fontSize: '10px', color: 'var(--color-text-dim)', marginBottom: '8px' }}>
                    YOUR SCORE
                </p>
                <div className="score-display">
                    {score} <span style={{ fontSize: '24px', color: 'var(--color-text-dim)' }}>/ {total}</span>
                </div>

                <div className="pixel-progress" style={{ marginTop: '24px' }}>
                    <div
                        className="pixel-progress__bar"
                        style={{
                            width: `${percentage}%`,
                            background: passed
                                ? 'linear-gradient(90deg, var(--color-success), var(--color-accent))'
                                : 'linear-gradient(90deg, var(--color-error), var(--color-warning))'
                        }}
                    ></div>
                    <span className="pixel-progress__text">{percentage}%</span>
                </div>

                <p style={{ fontSize: '10px', color: 'var(--color-text-dim)', marginTop: '16px' }}>
                    通過門檻：{passThreshold} 題
                </p>
            </div>

            <details className="pixel-card fade-in" style={{
                width: '100%',
                maxWidth: '600px',
                animationDelay: '0.6s'
            }} open>
                <summary style={{ cursor: 'pointer', fontSize: '12px', color: 'var(--color-warning)' }}>
                    📋 答題明細 (Review)
                </summary>
                <div style={{ marginTop: '16px' }}>
                    {results.map((r, index) => (
                        <div
                            key={index}
                            style={{
                                padding: '12px',
                                marginBottom: '8px',
                                background: r.isCorrect ? 'rgba(0, 210, 106, 0.1)' : 'rgba(255, 71, 87, 0.1)',
                                border: `2px solid ${r.isCorrect ? 'var(--color-success)' : 'var(--color-error)'}`,
                                fontSize: '10px',
                                lineHeight: '1.6'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: 'var(--color-accent)' }}>Q{index + 1}</span>
                                <span style={{ color: r.isCorrect ? 'var(--color-success)' : 'var(--color-error)' }}>
                                    {r.isCorrect ? '✓ 正確' : '✗ 錯誤'}
                                </span>
                            </div>

                            {r.question && (
                                <p style={{ color: 'var(--color-text)', marginBottom: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                                    {r.question}
                                </p>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div>
                                    <span style={{ color: 'var(--color-text-dim)' }}>你的答案：</span>
                                    <span style={{ color: r.isCorrect ? 'var(--color-success)' : 'var(--color-error)', marginLeft: '4px' }}>
                                        <strong>({r.selected})</strong> {r.selectedText}
                                    </span>
                                </div>
                                {!r.isCorrect && (
                                    <div>
                                        <span style={{ color: 'var(--color-text-dim)' }}>正確答案：</span>
                                        <span style={{ color: 'var(--color-success)', marginLeft: '4px' }}>
                                            <strong>({r.correctAnswer})</strong> {r.correctAnswerText}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </details>

            <div className="fade-in" style={{ display: 'flex', gap: '16px', animationDelay: '0.8s', marginTop: '16px' }}>
                <button className="pixel-btn pixel-btn--accent" onClick={handlePlayAgain}>
                    🔄 再玩一次
                </button>
                <button className="pixel-btn pixel-btn--secondary" onClick={handleBackHome}>
                    🏠 返回首頁
                </button>
            </div>

            {passed && (
                <p className="fade-in blink" style={{ fontSize: '10px', color: 'var(--color-warning)', marginTop: '24px', animationDelay: '1s' }}>
                    ★ 恭喜通關！你真厲害！ ★
                </p>
            )}
        </div>
    );
};

export default ResultPage;
