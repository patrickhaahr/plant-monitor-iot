import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { plantApi, PlantData } from '../services/api';
import '../global.css';

export default function Home() {
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
  });

  const getMoistureStatus = (moisture: number) => {
    if (moisture < 500) return { text: 'Low - Water Needed!', color: 'text-red-500' };
    if (moisture < 800) return { text: 'Medium', color: 'text-yellow-500' };
    return { text: 'Good', color: 'text-green-500' };
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <View className="flex-1 bg-black p-6">
      <View className="bg-zinc-900 rounded-xl p-6 shadow-lg">
        <Text className="text-white text-2xl font-bold mb-6">Plant Status</Text>
        
        {isLoading ? (
          <Text className="text-gray-400 text-lg">Loading...</Text>
        ) : isError ? (
          <Text className="text-red-500 text-lg">
            Error: {error instanceof Error ? error.message : 'Failed to load plant data'}
          </Text>
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
          </>
        ) : null}
      </View>

      <Link href="/details" className="mt-6 text-gray-400 text-center block">
        View Plant Details
      </Link>
    </View>
  );
} 