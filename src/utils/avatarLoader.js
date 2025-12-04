// DiceBear Avatar 預載工具
// 使用 pixel-art 風格

const DICEBEAR_BASE_URL = 'https://api.dicebear.com/7.x/pixel-art/svg';
const AVATAR_COUNT = 100;

// 預先生成的頭像種子
const avatarSeeds = Array.from({ length: AVATAR_COUNT }, (_, i) => `boss-${i + 1}`);

// 預載所有頭像
let preloadedAvatars = [];

export const preloadAvatars = async () => {
  console.log('🎮 開始預載關主頭像...');
  
  preloadedAvatars = avatarSeeds.map((seed) => {
    const url = `${DICEBEAR_BASE_URL}?seed=${seed}&backgroundColor=transparent`;
    
    // 預載圖片
    const img = new Image();
    img.src = url;
    
    return url;
  });
  
  console.log(`✅ 已準備 ${AVATAR_COUNT} 張關主頭像`);
  return preloadedAvatars;
};

// 根據關卡取得頭像
export const getAvatarByLevel = (level) => {
  const index = (level - 1) % AVATAR_COUNT;
  return preloadedAvatars[index] || `${DICEBEAR_BASE_URL}?seed=boss-${level}&backgroundColor=transparent`;
};

// 取得隨機頭像
export const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * AVATAR_COUNT);
  return preloadedAvatars[randomIndex] || `${DICEBEAR_BASE_URL}?seed=random-${Date.now()}&backgroundColor=transparent`;
};

// 取得頭像 URL（支援自定義種子）
export const getAvatarUrl = (seed) => {
  return `${DICEBEAR_BASE_URL}?seed=${seed}&backgroundColor=transparent`;
};

export default {
  preloadAvatars,
  getAvatarByLevel,
  getRandomAvatar,
  getAvatarUrl,
};
