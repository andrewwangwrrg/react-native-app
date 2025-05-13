// contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  uid: string | null;
  login: (token: string, uid: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

// 創建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 提供者組件
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 組件掛載時檢查是否已有保存的憑證
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUid = await AsyncStorage.getItem("uid");
        
        if (storedToken && storedUid) {
          setToken(storedToken);
          setUid(storedUid);
        }
      } catch (error) {
        console.error("Failed to load auth info", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // 登入方法 - 保存憑證並導航到主頁
  const login = async (newToken: string, newUid: string) => {
    try {
      await AsyncStorage.setItem("token", newToken);
      await AsyncStorage.setItem("uid", newUid);
      
      setToken(newToken);
      setUid(newUid);
      
      // 導航到主頁
      router.replace("/");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // 登出方法 - 清除憑證並導航到登入頁
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("uid");
      
      setToken(null);
      setUid(null);
      
      // 導航到登入頁
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // 提供上下文值
  const contextValue: AuthContextType = {
    isAuthenticated: !!token,
    token,
    uid,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定義 Hook 方便使用上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};