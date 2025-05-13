// (tabs)/sensor.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { fetchSensorData, startSensorDataPolling, fetchDHTData } from '../app/(tabs)/services/sensorService';

const SensorScreen: React.FC = () => {
  const [sensorData, setSensorData] = useState<{
    pm1_0: number;
    pm2_5: number;
    pm10: number;
  } | null>(null);
  const [dhtData, setDhtData] = useState<{
    temperature: number;
    humidity: number;
  } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [pmData, dhtData] = await Promise.all([fetchSensorData(), fetchDHTData()]);
      setSensorData(pmData);
      setDhtData(dhtData);
      setError(null);
    } catch (error) {
      setError('無法連接感應器');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    handleRefresh();
    const stopPolling = startSensorDataPolling(
      (data) => {
        setSensorData(data);
        setError(null);
      },
      5000
    );

    return () => {
      stopPolling();
    };
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#9Bd35A', '#689F38']} />
      }
    >
      <Text style={styles.title}>感應器監控</Text>

      <View style={styles.sensorCard}>
        {error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={30} color="red" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <>
            {sensorData && (
              <View style={styles.sensorDataContainer}>
                <View style={styles.sensorDataItem}>
                  <MaterialCommunityIcons name="weather-hazy" size={30} color="#A29BFE" />
                  <Text style={styles.sensorDataText}>PM1.0: {sensorData.pm1_0} µg/m³</Text>
                </View>
                <View style={styles.sensorDataItem}>
                  <MaterialCommunityIcons name="weather-fog" size={30} color="#74B9FF" />
                  <Text style={styles.sensorDataText}>PM2.5: {sensorData.pm2_5} µg/m³</Text>
                </View>
                <View style={styles.sensorDataItem}>
                  <FontAwesome5 name="smog" size={30} color="#55EFC4" />
                  <Text style={styles.sensorDataText}>PM10: {sensorData.pm10} µg/m³</Text>
                </View>
              </View>
            )}
            {dhtData && (
              <View style={styles.sensorDataContainer}>
                <View style={styles.sensorDataItem}>
                  <MaterialCommunityIcons name="thermometer" size={30} color="#FF6B6B" />
                  <Text style={styles.sensorDataText}>溫度: {dhtData.temperature} °C</Text>
                </View>
                <View style={styles.sensorDataItem}>
                  <MaterialCommunityIcons name="water-percent" size={30} color="#4ECDC4" />
                  <Text style={styles.sensorDataText}>濕度: {dhtData.humidity} %</Text>
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
  },
  sensorCard: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  sensorDataContainer: {
    flexDirection: 'column',
  },
  sensorDataItem: {
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  sensorDataText: {
    marginTop: 5,
    fontSize: 16,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default SensorScreen;
