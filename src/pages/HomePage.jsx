import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { preloadAvatars } from '../utils/avatarLoader';
import '../styles/pixel.css';

const HomePage = () => {
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // 預載頭像
        const init = async () => {
            try {
                await preloadAvatars();
            } catch (err) {
                console.warn('頭像預載失敗，遊戲仍可進行', err);
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, []);

    const handleStart = () => {
        if (!userId.trim()) {
            setError('請輸入你的 ID！');
            return;
        }
        // 儲存 userId 到 sessionStorage
        sessionStorage.setItem('userId', userId.trim());
        navigate('/game');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleStart();
        }
    };

    return (
        <div className="screen-container">
            <div className="scanlines"></div>

            {/* 遊戲標題 */}
            <div className="fade-in">
                <h1 className="pixel-title pixel-title--large">
                    🎮 PIXEL QUIZ 🎮
                </h1>
                <p className="pixel-title pixel-title--small" style={{ marginTop: '16px', color: 'var(--color-accent)' }}>
                    闖關問答挑戰
                </p>
            </div>

            {/* 輸入區塊 */}
            <div className="pixel-box fade-in" style={{
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                animationDelay: '0.2s'
            }}>
                <label style={{
                    display: 'block',
                    marginBottom: '16px',
                    fontSize: '12px',
                    color: 'var(--color-warning)'
                }}>
                    輸入你的 ID
                </label>

                <input
                    type="text"
                    className="pixel-input"
                    placeholder="YOUR ID"
                    value={userId}
                    onChange={(e) => {
                        setUserId(e.target.value);
                        setError('');
                    }}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    autoFocus
                />

                {error && (
                    <p style={{
                        color: 'var(--color-error)',
                        fontSize: '10px',
                        marginTop: '12px'
                    }}>
                        ⚠️ {error}
                    </p>
                )}

                <button
                    className="pixel-btn"
                    onClick={handleStart}
                    disabled={isLoading}
                    style={{ marginTop: '24px', width: '100%' }}
                >
                    {isLoading ? (
                        <span className="loading"></span>
                    ) : (
                        '▶ START GAME'
                    )}
                </button>
            </div>

            {/* 遊戲說明 */}
            <div className="fade-in" style={{
                textAlign: 'center',
                fontSize: '10px',
                color: 'var(--color-text-dim)',
                maxWidth: '400px',
                lineHeight: '1.8',
                animationDelay: '0.4s'
            }}>
                <p>回答問題，挑戰關主！</p>
                <p>答對 {import.meta.env.VITE_PASS_THRESHOLD || 7} 題以上即可通關</p>
            </div>

            {/* 版本資訊 */}
            <div style={{
                position: 'fixed',
                bottom: '16px',
                fontSize: '8px',
                color: 'var(--color-text-dim)'
            }}>
                v1.0 • PIXEL QUIZ GAME
            </div>
        </div>
    );
};

export default HomePage;
