import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AirQualityTab from '../../screens/AirQualityTab';
import FireDetectionTab from '../../screens/FireLogScreen';

const Tab = createMaterialTopTabNavigator();

const SensorScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#d63031',
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: '#d63031' },
        }}
      >
        <Tab.Screen name="空氣品質" component={AirQualityTab} />
        <Tab.Screen name="火源偵測" component={FireDetectionTab} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20, // 你也可以根據實際情況調整
    backgroundColor: '#fff',
  },
});

export default SensorScreen;
