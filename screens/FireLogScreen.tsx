import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { fetchLatestFireLog } from '../app/(tabs)/services/fireService';

const FireLogScreen: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [videoKey, setVideoKey] = useState<string>(''); // 💡 用來強制重建 Video

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fireData = await fetchLatestFireLog();
  
        // ✅ 如果影片真的換了才更新
        if (!data || fireData.video_name !== data.video_name) {
          setVideoKey(fireData.video_name);
          setData(fireData);
        }
  
        setError(null);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        setError('無法載入火源紀錄');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  
    const interval = setInterval(fetchData, 5000); // 每 5 秒更新
    return () => clearInterval(interval);
  }, [data?.video_name]); // 👈 只在影片名稱變更時觸發
  

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔥 最新火源紀錄</Text>
      <Text style={styles.subtitle}>時間：{data.detected_at}</Text>
      <Text style={styles.status}>
        偵測結果：{data.fire_detected ? '🚨 發現火源' : '✅ 無火源'}
      </Text>

      {/* key 變了會強制重新渲染並播放新影片 */}
      <Video
        key={videoKey}
        source={{ uri: `http://192.168.0.140:8000/uploaded_videos/${data.video_name}` }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="contain"
        shouldPlay
        useNativeControls
        style={styles.video}
      />

      {lastUpdated && <Text style={styles.updated}>更新時間：{lastUpdated}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d63031',
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    backgroundColor: '#000',
  },
  updated: {
    marginTop: 10,
    fontSize: 14,
    color: '#636e72',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default FireLogScreen;
