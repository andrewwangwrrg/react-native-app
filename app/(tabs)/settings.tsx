import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from "expo-router";
import * as Updates from 'expo-updates';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from "../../contexts/AuthContext";

const SettingsScreen = () => {
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const styles = getStyles(darkModeEnabled);

  const accoutOptions = [];

  if (isAuthenticated) {
    accoutOptions.push({
      icon: <MaterialIcons name="account-circle" size={24} color="#FFB347" />,
      title: '帳號內容',
      onPress: () => {
        router.push("/accout-details");
      },
    });
  }
  
  accoutOptions.push({
    icon: <MaterialIcons name={isAuthenticated ? 'logout' : 'login'} size={24} color="#FFA500" />,
    title: isAuthenticated ? '登出帳號' : '登入帳號',
    onPress: async () => {
      if (isAuthenticated) {
        // 執行登出邏輯
        try {
          await logout();
          console.log('已登出');
        } catch (error) {
          console.error('登出失敗:', error);
        }
      } else {
        // 導航到登入頁面
        router.push("/login");
        console.log('前往登入頁面');
      }
    },
  });

  const settingOptions = [
    {
      icon: <Ionicons name="notifications" size={24} color="#FF6B6B" />,
      title: '通知設定',
      component: (
        <Switch
          value={notificationEnabled}
          onValueChange={setNotificationEnabled}
        />
      )
    },
    {
      icon: <MaterialIcons name="dark-mode" size={24} color="#4ECDC4" />,
      title: '深色模式',
      component: (
        <Switch
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
        />
      )
    }
  ];

  // 檢查更新的函數
  const checkForUpdates = async () => {
    setIsCheckingUpdate(true);
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert(
          "有新版本可用",
          "是否立即更新?",
          [
            {
              text: "稍後",
              style: "cancel"
            },
            { 
              text: "更新", 
              onPress: async () => {
                try {
                  await Updates.fetchUpdateAsync();
                  Alert.alert("更新成功", "重新啟動應用程式以套用更新", [
                    { text: "立即重啟", onPress: () => Updates.reloadAsync() }
                  ]);
                } catch (error) {
                  Alert.alert("更新失敗", "請檢查您的網絡連接並重試");
                }
              }
            }
          ]
        );
      } else {
        Alert.alert("無可用更新", "您已是最新版本");
      }
    } catch (error) {
      Alert.alert("檢查更新失敗", "請檢查您的網絡連接並重試");
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const systemOptions = [
    { 
      icon: <FontAwesome5 name="info-circle" size={24} color="#45B7D1" />, 
      title: '關於系統', 
      onPress: () => router.push("/about") 
    },
    { 
      icon: <MaterialIcons name="privacy-tip" size={24} color="#FF6B6B" />, 
      title: '隱私政策', 
      onPress: () => router.push("/privacy-policy") 
    },
    { 
      icon: <Ionicons name="refresh-circle" size={24} color="#4ECDC4" />, 
      title: '檢查更新', 
      onPress: checkForUpdates
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.backgroundColor} />
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>帳號選項</Text>
        {accoutOptions.map((option, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.systemOptionItem}
            onPress={option.onPress}
          >
            <View style={styles.accountOptionIconContainer}>
              {option.icon}
            </View>
            <Text style={styles.systemOptionTitle}>{option.title}</Text>
            <MaterialIcons 
              name="chevron-right" 
              size={24} 
              color={darkModeEnabled ? "#666" : "#888"} 
            />
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>系統設定</Text>
        {settingOptions.map((option, index) => (
          <View key={index} style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              {option.icon}
            </View>
            <Text style={styles.settingTitle}>{option.title}</Text>
            {option.component}
          </View>
        ))}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>系統選項</Text>
        {systemOptions.map((option, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.systemOptionItem}
            onPress={option.onPress}
            disabled={option.title === '檢查更新' && isCheckingUpdate}
          >
            <View style={styles.systemOptionIconContainer}>
              {option.icon}
            </View>
            <Text style={styles.systemOptionTitle}>{option.title}</Text>
            {option.title === '檢查更新' && isCheckingUpdate ? (
              <Ionicons name="sync" size={24} color={darkModeEnabled ? "#666" : "#888"} style={{animationName: 'rotate', animationDuration: '1s', animationIterationCount: 'infinite', animationTimingFunction: 'linear'}} />
            ) : (
              <MaterialIcons 
                name="chevron-right" 
                size={24} 
                color={darkModeEnabled ? "#666" : "#888"} 
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>版本: {Constants.expoConfig?.version || '1.0.0'}</Text>
      </View>
    </ScrollView>
  );
};

const getStyles = (darkMode: boolean) => StyleSheet.create({
  backgroundColor: {
    backgroundColor: darkMode ? '#121212' : '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: darkMode ?'#121212': '#f5f5f5',
  },
  sectionContainer: {
    backgroundColor: darkMode ?'#282828':'#FFFFFF',
    margin: 15,
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    color: darkMode ? '#FFFFFF' : '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingIconContainer: {
    marginRight: 15,
    backgroundColor: darkMode ?'#3f3f3f':'#f0f0f0',
    borderRadius: 50,
    padding: 8,
  },
  settingTitle: {
    color: darkMode ? '#FFFFFF' : '#000000',
    flex: 1,
    fontSize: 16,
  },
  systemOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  systemOptionIconContainer: {
    marginRight: 15,
    backgroundColor: darkMode ?'#3f3f3f':'#f0f0f0',
    borderRadius: 50,
    padding: 8,
  },
  systemOptionTitle: {
    color: darkMode ? '#FFFFFF' : '#000000',
    flex: 1,
    fontSize: 16,
  },
  accountOptionIconContainer: {
    marginRight: 15,
    backgroundColor: darkMode ?'#3f3f3f':'#f0f0f0',
    borderRadius: 50,
    padding: 8,
  },
  accountOptionTitle: {
    color: darkMode ? '#FFFFFF' : '#000000',
    flex: 1,
    fontSize: 16,
  },
  versionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    color: darkMode ? '#999' : '#666',
    fontSize: 14,
  },
});

export default SettingsScreen;