// App.js - React Native 藍芽RSSI偵測應用程式
// 使用 expo-bluetooth 替代 react-native-ble-plx

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import * as Bluetooth from 'expo-bluetooth';
import { decode as btoa } from 'base-64';

const App = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState({});
  const [strongestDevice, setStrongestDevice] = useState(null);
  const [bluetoothState, setBluetoothState] = useState('未知');

  // 初始化藍芽
  useEffect(() => {
    checkBluetoothState();
    
    // 監聽藍芽狀態變化
    const subscription = Bluetooth.addStateListener((state) => {
      let stateStr = '未知';
      
      switch (state) {
        case Bluetooth.BluetoothState.POWERED_ON:
          stateStr = '已開啟';
          break;
        case Bluetooth.BluetoothState.POWERED_OFF:
          stateStr = '已關閉';
          break;
        case Bluetooth.BluetoothState.RESETTING:
          stateStr = '重置中';
          break;
        case Bluetooth.BluetoothState.UNAUTHORIZED:
          stateStr = '未授權';
          break;
        case Bluetooth.BluetoothState.UNSUPPORTED:
          stateStr = '不支援';
          break;
      }
      
      setBluetoothState(stateStr);
    });
    
    return () => {
      // 清理訂閱
      subscription.remove();
      // 確保停止掃描
      if (isScanning) {
        stopScan();
      }
    };
  }, []);

  // 檢查藍芽狀態
  const checkBluetoothState = async () => {
    try {
      const state = await Bluetooth.getStateAsync();
      let stateStr = '未知';
      
      switch (state) {
        case Bluetooth.BluetoothState.POWERED_ON:
          stateStr = '已開啟';
          break;
        case Bluetooth.BluetoothState.POWERED_OFF:
          stateStr = '已關閉';
          break;
        case Bluetooth.BluetoothState.RESETTING:
          stateStr = '重置中';
          break;
        case Bluetooth.BluetoothState.UNAUTHORIZED:
          stateStr = '未授權';
          break;
        case Bluetooth.BluetoothState.UNSUPPORTED:
          stateStr = '不支援';
          break;
      }
      
      setBluetoothState(stateStr);
    } catch (error) {
      console.error('檢查藍芽狀態時出錯:', error);
      setBluetoothState('錯誤');
    }
  };

  // 請求所需的權限
  const requestPermissions = async () => {
    try {
      // expo-bluetooth 會自動處理權限請求
      const isAvailable = await Bluetooth.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('藍芽不可用', '您的設備不支持藍芽功能');
        return false;
      }

      const enabled = await Bluetooth.isPoweredOnAsync();
      if (!enabled) {
        Alert.alert('藍芽未啟用', '請開啟藍芽以掃描設備');
        return false;
      }

      // 在 Android 上請求位置權限
      if (Platform.OS === 'android') {
        const permissionResult = await Bluetooth.requestPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert('權限錯誤', '需要藍芽和位置權限才能掃描設備');
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('請求權限時出錯:', error);
      Alert.alert('權限錯誤', '請求藍芽權限時出錯');
      return false;
    }
  };

  // 處理掃描結果
  const handleDiscoverDevice = (device) => {
    // 只處理有名稱且名稱中包含"RaspberryPi-Sensor"的設備
    if (device.name && device.name.includes('RaspberryPi-Sensor')) {
      try {
        // 從製造商數據解析設備信息
        let manufacturerData = {};
        
        if (device.manufacturerData) {
          // 解碼製造商數據
          const decodedData = btoa(device.manufacturerData);
          // 尋找我們的數據格式
          const dataString = decodedData.replace(/[\x00-\x1F\x7F-\xFF]/g, '');
          
          // 尋找格式為"namespaceId;instanceId;name;0"的數據
          const dataMatch = dataString.match(/([^;]+);([^;]+);([^;]+);(\d+)/);
          
          if (dataMatch) {
            manufacturerData = {
              namespaceId: dataMatch[1],
              instanceId: dataMatch[2],
              name: dataMatch[3],
            };
          }
        }
        
        // 更新設備列表
        setDevices(prevDevices => {
          const newDevices = {
            ...prevDevices,
            [device.id]: {
              id: device.id,
              name: device.name,
              rssi: device.rssi,
              ...manufacturerData
            }
          };
          
          // 找出信號最強的設備
          let strongest = null;
          let maxRssi = -Infinity;
          
          Object.values(newDevices).forEach(dev => {
            if (dev.rssi && dev.rssi > maxRssi) {
              maxRssi = dev.rssi;
              strongest = dev;
            }
          });
          
          // 更新最強設備
          setStrongestDevice(strongest);
          
          return newDevices;
        });
      } catch (error) {
        console.error('處理設備數據時出錯:', error);
      }
    }
  };

  // 開始掃描
  const startScan = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    
    // 清除先前的設備列表
    setDevices({});
    setStrongestDevice(null);
    
    setIsScanning(true);
    
    try {
      // 設置設備發現回調
      const scanSubscription = Bluetooth.addDeviceDiscoveredListener((device) => {
        handleDiscoverDevice(device);
      });
      
      // 開始掃描
      await Bluetooth.scanForDevicesAsync({
        // 可以設置服務 UUID 過濾，但這裡我們掃描所有設備
        allowDuplicates: true, // 允許重複發現同一設備以更新 RSSI
      });
      
      // 30秒後停止掃描
      setTimeout(() => {
        scanSubscription.remove();
        Bluetooth.stopScanAsync().catch(error => {
          console.error('停止掃描時出錯:', error);
        });
        setIsScanning(false);
      }, 30000);
    } catch (error) {
      console.error('開始掃描時出錯:', error);
      Alert.alert('掃描錯誤', `掃描設備時出錯: ${error.message}`);
      setIsScanning(false);
    }
  };

  // 停止掃描
  const stopScan = async () => {
    try {
      await Bluetooth.stopScanAsync();
    } catch (error) {
      console.error('停止掃描時出錯:', error);
    }
    setIsScanning(false);
  };

  // 計算 RSSI 的強度描述
  const getRssiLevel = (rssi) => {
    if (!rssi) return '未知';
    if (rssi >= -50) return '極強';
    if (rssi >= -65) return '很強';
    if (rssi >= -75) return '中等';
    if (rssi >= -85) return '弱';
    return '很弱';
  };

  // 渲染設備項目
  const renderDeviceItem = ({ item }) => {
    const isStrongest = strongestDevice && item.id === strongestDevice.id;
    
    return (
      <View style={[styles.deviceItem, isStrongest && styles.strongestDevice]}>
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>{item.name}</Text>
          <Text>命名空間ID: {item.namespaceId || '未知'}</Text>
          <Text>實例ID: {item.instanceId || '未知'}</Text>
          <Text>RSSI: {item.rssi} dBm ({getRssiLevel(item.rssi)})</Text>
        </View>
        {isStrongest && (
          <View style={styles.strongestBadge}>
            <Text style={styles.strongestText}>最強信號</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.header}>
        <Text style={styles.title}>樹梅派藍芽RSSI偵測</Text>
      </View>
      
      <View style={styles.bluetoothState}>
        <Text style={styles.bluetoothStateText}>藍芽狀態: {bluetoothState}</Text>
      </View>
      
      <View style={styles.controlPanel}>
        <TouchableOpacity
          style={[styles.button, isScanning ? styles.buttonStop : styles.buttonStart]}
          onPress={isScanning ? stopScan : startScan}
        >
          <Text style={styles.buttonText}>
            {isScanning ? '停止掃描' : '開始掃描'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {isScanning ? '正在掃描...' : '掃描已停止'}
        </Text>
        <Text style={styles.deviceCount}>
          找到設備: {Object.keys(devices).length}
        </Text>
      </View>
      
      {strongestDevice && (
        <View style={styles.strongestContainer}>
          <Text style={styles.strongestTitle}>最強信號設備:</Text>
          <Text style={styles.strongestName}>{strongestDevice.name}</Text>
          <Text style={styles.strongestRssi}>
            信號強度: {strongestDevice.rssi} dBm ({getRssiLevel(strongestDevice.rssi)})
          </Text>
        </View>
      )}
      
      <FlatList
        data={Object.values(devices).sort((a, b) => (b.rssi || -Infinity) - (a.rssi || -Infinity))}
        renderItem={renderDeviceItem}
        keyExtractor={item => item.id}
        style={styles.deviceList}
        contentContainerStyle={styles.deviceListContent}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            {isScanning ? '正在搜尋設備...' : '未找到樹梅派設備'}
          </Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#3498db',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  bluetoothState: {
    padding: 8,
    backgroundColor: '#2980b9',
    alignItems: 'center',
  },
  bluetoothStateText: {
    fontSize: 14,
    color: '#fff',
  },
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStart: {
    backgroundColor: '#2ecc71',
  },
  buttonStop: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#555',
  },
  deviceCount: {
    fontSize: 14,
    color: '#555',
  },
  deviceList: {
    flex: 1,
  },
  deviceListContent: {
    padding: 8,
  },
  deviceItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  strongestDevice: {
    backgroundColor: '#e8f5ff',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  strongestBadge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  strongestText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyListText: {
    textAlign: 'center',
    padding: 24,
    color: '#999',
  },
  strongestContainer: {
    backgroundColor: '#3498db',
    padding: 12,
    margin: 8,
    borderRadius: 8,
  },
  strongestTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  strongestName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  strongestRssi: {
    color: '#fff',
    marginTop: 4,
  },
});

export default App;