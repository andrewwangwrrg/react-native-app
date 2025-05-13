import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { ActivityIndicator, Animated, View } from "react-native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();  // 使用 useTheme 取得動畫和模式

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }



  // 未認證用戶
  if (!isAuthenticated) {
    return (
      <Animated.View style={{ flex: 1}}>
        <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
          <Tabs.Screen
            name="login"
            options={{
              title: "登入",
              headerShown: false
            }}
          />
          <Tabs.Screen
            name="(tabs)/floorplan"
            options={{
              href: null
            }}
          />
        </Tabs>
      </Animated.View>
    );
  }

  // 已認證用戶
  return (
    <Animated.View style={{ flex: 1}}>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="(tabs)/index"
          options={{
            title: "首頁",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/sensor"
          options={{
            title: "傳感器",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="speedometer" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/settings"
          options={{
            title: "設定",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/floorplan"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="login"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="accout-details"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="privacy-policy"
          options={{
            href: null
          }}
        />
      </Tabs>
    </Animated.View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
        <RootLayoutNav />
    </AuthProvider>
  );
}
