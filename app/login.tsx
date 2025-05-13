import axios from "axios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = "http://192.168.0.140:4000";

  const handleLogin = async () => {
    // Validate input
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      console.log("Login response:", response.data);

      if (response.data.status === 20001) {
        const { token, uid } = response.data;
        await login(token, uid.toString());
      } else {
        setError(response.data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    // 驗證輸入
    if (!username.trim() || !password.trim() || !email.trim()) {
      setError("請填寫所有欄位");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("密碼不匹配");
      return;
    }
    
    if (password.length < 6) {
      setError("密碼長度至少需要6個字符");
      return;
    }
  
    setLoading(true);
    setError("");
    setSuccess("");
  
    try {
      // 確保這是正確的註冊 API 端點
      const response = await axios.post(`${API_URL}/register`, {
        username,
        password,
        email
      });
  
      console.log("註冊回應:", response.data);
  
      if (response.data.status === 20001) {
        setSuccess("註冊成功！您現在可以登入了。");
        setIsLogin(true);
        // 清空註冊表單
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(response.data.message || "註冊失敗。請重試。");
      }
    } catch (error) {
      console.error("註冊錯誤:", error);
      // 添加更詳細的錯誤訊息
      if (error.response) {
        console.log("錯誤數據:", error.response.data);
        console.log("錯誤狀態:", error.response.status);
        setError(`服務器錯誤: ${error.response.status} - ${error.response.data.message || "未知錯誤"}`);
      } else if (error.request) {
        console.log("無回應:", error.request);
        setError("服務器無回應。請檢查服務器狀態。");
      } else {
        console.log("錯誤訊息:", error.message);
        setError(`連接錯誤: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    // 清空所有輸入欄位，以避免混淆
    if (isLogin) {
      // 切換到註冊模式時清空密碼
      setPassword("");
    } else {
      // 切換到登入模式時清空全部
      setPassword("");
      setEmail("");
      setConfirmPassword("");
    }
    console.log("切換到:", isLogin ? "註冊" : "登入", "模式");
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/150' }} 
            style={styles.logo} 
          />
          <Text style={styles.title}>Smart Home {isLogin ? "Login" : "Register"}</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#888"
            autoCapitalize="none"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setError("");
            }}
          />

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError("");
              }}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError("");
            }}
          />
          
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setError("");
              }}
            />
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>{success}</Text> : null}

          <TouchableOpacity 
            style={styles.button}
            onPress={isLogin ? handleLogin : handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{isLogin ? "登入" : "註冊"}</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.switchButton}
            onPress={toggleForm}
          >
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Smart Home System v1.0</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  logoContainer: {
    paddingTop: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  formContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  errorText: {
    color: "#ff3b30",
    marginBottom: 15,
    textAlign: "center",
  },
  successText: {
    color: "#34c759",
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0066cc",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchButton: {
    marginTop: 20,
    alignItems: "center",
  },
  switchText: {
    color: "#0066cc",
    fontSize: 14,
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    color: "#888",
    fontSize: 14,
  }
});