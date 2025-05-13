import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Stack } from "expo-router";
import React from 'react';
import {
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const AboutScreen = () => {
  const appName = Constants.expoConfig?.name || '我的應用';
  const version = Constants.expoConfig?.version || '1.0.0';
  const description = "這是一個為您提供便捷服務的行動應用，希望能夠提升您的使用體驗，並解決您在日常生活中遇到的各種問題。";
  
  const contactEmail = "andrewwangwrrg@gmail.com";
  const websiteUrl = "https://chatgpt.com";
  
  const openEmail = () => {
    Linking.openURL(`mailto:${contactEmail}`);
  };
  
  const openWebsite = () => {
    Linking.openURL(websiteUrl);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: "關於系統",
        headerShadowVisible: false,
        gestureEnabled: true,
        gestureDirection: "horizontal"
      }} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/gura.gif')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>{appName}</Text>
          <Text style={styles.version}>版本 {version}</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>應用簡介</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>聯絡我們</Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={openEmail}>
            <Ionicons name="mail-outline" size={24} color="#45B7D1" />
            <Text style={styles.contactText}>{contactEmail}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem} onPress={openWebsite}>
            <Ionicons name="globe-outline" size={24} color="#45B7D1" />
            <Text style={styles.contactText}>{websiteUrl}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>技術資訊</Text>
          <Text style={styles.infoItem}>React Native: 0.73.2</Text>
          <Text style={styles.infoItem}>Expo SDK: {Constants.expoConfig?.sdkVersion}</Text>
          <Text style={styles.infoItem}>平台: {Constants.platform?.ios ? 'iOS' : 'Android'}</Text>
        </View>
        
        <View style={styles.copyrightContainer}>
          <Text style={styles.copyright}>© 2025 MyApp. 保留所有權利。</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#45B7D1',
  },
  infoItem: {
    fontSize: 15,
    marginBottom: 8,
    color: '#555',
  },
  copyrightContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  copyright: {
    fontSize: 14,
    color: '#888',
  },
});

export default AboutScreen;