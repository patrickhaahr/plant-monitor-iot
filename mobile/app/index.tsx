import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { plantApi, PlantData } from '../services/api';
import * as Notifications from 'expo-notifications';
import '../global.css';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

async function scheduleNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: null, // null means show immediately
  });
}

export default function Home() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const checkMoistureAndNotify = (data: PlantData) => {
    if (data.moisture > 3000) {
      scheduleNotification(
        '🪴 Plant Needs Water!',
        'Your plant is very dry and needs water soon.'
      );
    } else if (data.moisture > 2200) {
      scheduleNotification(
        '🌱 Plant Check Needed',
        'Your plant is getting dry, consider watering it.'
      );
    }
  };

  const { 
    data: plantData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['sensorData', 'current'],
    queryFn: plantApi.getCurrentData,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 1 * 60 * 1000, // Consider data stale after 1 minute
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    gcTime: 1000 * 60 * 60, // Keep cache for 1 hour
  });

  // Check moisture levels whenever we get new data
  useEffect(() => {
    if (plantData) {
      checkMoistureAndNotify(plantData);
    }
  }, [plantData]);

  const getMoistureStatus = (moisture: number) => {
    if (moisture > 3000) return { text: 'Very Dry - Water Needed!', color: 'text-red-500' };
    if (moisture > 2200) return { text: 'Dry - Consider Watering', color: 'text-yellow-500' };
    if (moisture > 1800) return { text: 'Slightly Dry', color: 'text-yellow-300' };
    if (moisture > 1400) return { text: 'Good Moisture', color: 'text-green-500' };
    return { text: 'Very Wet', color: 'text-blue-500' };
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, { 
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ScrollView 
      className="flex-1 bg-black"
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={refetch}
          tintColor="#9ca3af"
          colors={["#9ca3af"]}
          progressBackgroundColor="#18181b"
        />
      }
    >
      <View className="p-6">
        <View className="bg-zinc-900 rounded-xl p-6 shadow-lg">
          <Text className="text-white text-2xl font-bold mb-6">Plant Status</Text>
          
          {isLoading && !plantData ? (
            <Text className="text-gray-400 text-lg">Loading...</Text>
          ) : plantData ? (
            <>
              <View className="space-y-4">
                <View>
                  <Text className="text-gray-400 text-base">Moisture Level</Text>
                  <Text className={`text-3xl font-bold ${getMoistureStatus(plantData.moisture).color}`}>
                    {plantData.moisture}
                  </Text>
                  <Text className={`text-lg ${getMoistureStatus(plantData.moisture).color}`}>
                    {getMoistureStatus(plantData.moisture).text}
                  </Text>
                  {isError && (
                    <Text className="text-yellow-500 text-sm mt-1">
                      Unable to fetch new data. Showing last known values.
                    </Text>
                  )}
                </View>

                <View>
                  <Text className="text-gray-400 text-base">Last Updated</Text>
                  <Text className="text-white text-lg">
                    {formatDate(plantData.timestamp)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity 
                className="mt-6 bg-zinc-800 p-4 rounded-lg active:bg-zinc-700"
                onPress={() => refetch()}
                disabled={isFetching}
              >
                <Text className="text-white text-center">
                  {isFetching ? 'Refreshing...' : 'Refresh Data'}
                </Text>
              </TouchableOpacity>

              <Link href="/details" asChild>
                <TouchableOpacity 
                  className="mt-4 bg-zinc-800 p-4 rounded-lg active:bg-zinc-700"
                >
                  <Text className="text-white text-center">
                    View Plant Details
                  </Text>
                </TouchableOpacity>
              </Link>
            </>
          ) : (
            <Text className="text-red-500 text-lg">
              Error: No data available
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
} 