export const fetchSensorData = async () => {
try{
  const response = await fetch('http://192.168.0.130:5000/upload_pms');
  const data = await response.json();
  return {
    pm1_0: data.pm1_0,
    pm2_5: data.pm2_5,
    pm10: data.pm10,
  };
} catch (err) {
  console.error("Fetch error:", err);
  throw err;
}
};

export const fetchDHTData = async () => {
  try {
    const response = await fetch('http://192.168.0.130:5000/upload_dht');
    const data = await response.json();
    return {
      temperature: data.temperature,
      humidity: data.humidity,
    };
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
};

export const startSensorDataPolling = (callback: (data: any) => void, interval: number) => {
  const intervalId = setInterval(async () => {
    try {
      const data = await fetchSensorData();
      callback(data);
    } catch (err) {
      console.error('讀取失敗:', err);
    }
  }, interval);

  return () => clearInterval(intervalId);
};


