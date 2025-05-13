import React, { useState, useEffect } from 'react';
import { 
  View, 
  SafeAreaView,
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { fetchSensorData, fetchDHTData } from './services/sensorService'; // ⬅️ 多引入 fetchDHTData
import { fetchLatestFireLog } from './services/fireService';
import { useRouter } from 'expo-router';

const HomeScreen: React.FC = () => {
  const router = useRouter();

  const quickActions = [
    { 
      icon: <MaterialIcons name="sensors" size={30} color="#FF6B6B" />, 
      title: '感應器監控', 
      description: '查看完整的環境數據',
      onPress: () => router.push('/(tabs)/sensor')
    },
    { 
      icon: <Ionicons name="walk" size={30} color="#4ECDC4" />, 
      title: '歷史紀錄', 
      description: '查看使用者歷史紀錄',
      onPress: () => router.push('/(tabs)/floorplan')
    }, 
  ];

  const [isFireDetected, setIsFireDetected] = useState<any>(null);
  const [pm25, setPm25] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);

  useEffect(() => {
    const fetchFireStatus = async () => {
      try {
        const data = await fetchLatestFireLog();
        setIsFireDetected(data);
      } catch (error) {
        console.error('抓取火災狀態失敗：', error);
        setIsFireDetected(true);
      }
    };

    fetchFireStatus();
    const intervalId = setInterval(fetchFireStatus, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const getSensorData = async () => {
      try {
        const pmData = await fetchSensorData();
        const dhtData = await fetchDHTData();
        setPm25(pmData.pm2_5);
        setTemperature(dhtData.temperature);
        setHumidity(dhtData.humidity);
      } catch (error) {
        console.error('無法取得感應器資料:', error);
      }
    };

    getSensorData();
    const intervalId = setInterval(getSensorData, 5000); // 每5秒更新一次感應器資料

    return () => clearInterval(intervalId);
  }, []);

  const fireDetails = {
    location: '2樓辦公室',
    detectedAt: '2025-04-15 14:30',
    currentLocation: '1樓走廊',
  };

  const getCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const date = `${now.getDate()}`.padStart(2, '0');
    const hours = `${now.getHours()}`.padStart(2, '0');
    const minutes = `${now.getMinutes()}`.padStart(2, '0');
    const seconds = `${now.getSeconds()}`.padStart(2, '0');
    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  };

  const [fireTime, setFireTime] = useState(getCurrentTime());
  useEffect(() => {
    const timer = setInterval(() => {
      setFireTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.headerContainer}>
        <Text style={styles.headerTitle}>火災通報系統📢</Text>
      </SafeAreaView>

      <View style={styles.envContainer}>
        <View style={styles.envItem}>
          <Ionicons name="time-outline" size={24} color="#b87333" />
          <Text style={styles.envText}>現在時間：{fireTime}</Text>
        </View>
      </View>

      <View style={styles.envContainer}>
        <View style={styles.envItem}>
          <Ionicons name="thermometer" size={24} color="#FF6B6B" />
          <Text style={styles.envText}>
            溫度：{temperature !== null ? `${temperature} °C` : '讀取中...'}
          </Text>
        </View>
        <View style={styles.envItem}>
          <MaterialIcons name="opacity" size={24} color="#4ECDC4" />
          <Text style={styles.envText}>
            濕度：{humidity !== null ? `${humidity} %` : '讀取中...'}
          </Text>
        </View>
      </View>

      <View style={styles.quickActionContainer}>
        {quickActions.map((action, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.actionCard}
            onPress={action.onPress}
          >
            <View style={styles.actionIconContainer}>
              {action.icon}
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.alertContainer}>
        {isFireDetected ? (
          <View style={styles.fireAlertBox}>
            <Text style={styles.fireAlertText}>⚠️ 偵測到火災！請儘速撤離！</Text>
            <View style={styles.fireTextContainer1}>
              <Text style={styles.fireDetailText}>發生位置：{fireDetails.location}</Text>
              <Text style={styles.fireDetailText}>火災時間：{fireDetails.detectedAt}</Text>
              <Text style={styles.fireDetailText}>目前位置：{fireDetails.currentLocation}</Text>
            </View>
            <View style={styles.fireTextContainer2}>
              <TouchableOpacity 
                style={styles.fireAlertButton} 
                onPress={() => router.push('/(tabs)/floorplan')}
              >
                <Text style={styles.fireAlertButtonText}>
                  ！！！按此進入逃生圖！！！{'\n'}！！！並請立即前往安全地點！！！
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.placeholderBox}></View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerContainer: { backgroundColor: '#FFFFFF', alignItems: 'center' },
  headerTitle: { fontSize: 27, fontWeight: 'bold', marginBottom: 10 },
  envContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: -5,
  },
  envItem: { flexDirection: 'row', alignItems: 'center' },
  envText: { marginLeft: 8, fontSize: 16, color: '#444' },
  quickActionContainer: { padding: 15 },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    elevation: 2,
  },
  actionIconContainer: {
    marginRight: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    padding: 10,
  },
  actionTextContainer: { flex: 1 },
  actionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 3 },
  actionDescription: { color: '#888' },
  alertContainer: { paddingHorizontal: 20, marginBottom: 20 },
  fireAlertBox: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    marginBottom: 10,
  },
  fireAlertText: { color: '#fff', fontWeight: 'bold', fontSize: 26 },
  fireDetailText: { color: '#fff', fontSize: 20, marginTop: 20, marginRight: 70, textAlign: 'left' },
  placeholderBox: { height: 60 },
  fireTextContainer1: { marginTop: 30 },
  fireTextContainer2: { marginTop: 50 },
  fireAlertButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  fireAlertButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default HomeScreen;
