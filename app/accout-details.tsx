import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const AccountDetailsScreen = () => {
  const { token, uid } = useAuth();
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    // 其他用戶資料欄位
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!token || !uid) {
        setError('未登入，無法載入資料');
        setLoading(false);
        return;
      }
      
      try {
        const API_URL = "http://192.168.0.140:4000"; // API 伺服器位址
        const response = await axios.get(`${API_URL}/api/user/${uid}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('用戶資料回應:', response.data);

        if (response.data && response.data.status === 20001) {
          setUserDetails({
            username: response.data.data.username,
            email: response.data.data.email,
            // 可依照需要加入更多欄位
          });
        } else {
          setError('無法載入用戶資料，請稍後再試');
        }
      } catch (error) {
        console.error('獲取用戶資料時出錯:', error);
        setError('連接錯誤，請確認網路或伺服器狀態');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [token, uid]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.heading}>帳號資料</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.loadingText}>載入中...</Text>
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.label}>使用者名稱:</Text>
              <Text style={styles.value}>{userDetails.username}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.label}>電子郵件:</Text>
              <Text style={styles.value}>{userDetails.email}</Text>
            </View>

            {/* 可依需求添加其他欄位，例如註冊時間、最後登入時間 */}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    width: 100,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    flex: 1,
    color: '#666',
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AccountDetailsScreen;
