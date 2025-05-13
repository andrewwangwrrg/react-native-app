// app/(tabs)/services/fireService.ts

export const fetchLatestFireLog = async () => {
  try {
    const response = await fetch('http://192.168.0.140:8000/latest_fire_log');
    if (!response.ok) {
      throw new Error('伺服器回傳錯誤');
    }
    return await response.json(); // 把資料轉成 JSON 回傳給 React Native
  } catch (error) {
    throw new Error('無法連接到伺服器');
  }
};
