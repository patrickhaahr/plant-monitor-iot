import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { plantApi, PlantData } from '../services/api';
import '../global.css';

function LoadingSkeleton() {
  return (
    <>
      <View className="bg-zinc-900 rounded-xl p-6 mb-6">
        <View className="h-8 w-48 bg-zinc-800 rounded mb-4" />
        <View className="space-y-2">
          <View className="h-5 w-32 bg-zinc-800 rounded" />
          <View className="h-5 w-40 bg-zinc-800 rounded" />
          <View className="h-5 w-36 bg-zinc-800 rounded" />
        </View>
      </View>

      <View className="bg-zinc-900 rounded-xl p-6">
        <View className="h-8 w-48 bg-zinc-800 rounded mb-4" />
        <View className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} className="border-b border-zinc-800 pb-4">
              <View className="flex-row justify-between items-center">
                <View className="h-6 w-20 bg-zinc-800 rounded" />
                <View className="h-5 w-32 bg-zinc-800 rounded" />
              </View>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}

export default function Details() {
  const { 
    data: history,
    isLoading,
    isError,
    error,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['sensorData', 'history'],
    queryFn: plantApi.getHistory,
    staleTime: 1 * 60 * 1000, // Consider data stale after 1 minute
    retry: 3,
    gcTime: 1000 * 60 * 60, // Keep cache for 1 hour
  });

  const getMoistureStatus = (moisture: number) => {
    if (moisture > 3000) return { text: 'Very Dry', color: 'text-red-500' };
    if (moisture > 2200) return { text: 'Dry', color: 'text-yellow-500' };
    if (moisture > 1800) return { text: 'Slightly Dry', color: 'text-yellow-300' };
    if (moisture > 1400) return { text: 'Good', color: 'text-green-500' };
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
    <View className="flex-1 bg-black">
      <ScrollView 
        className="p-6"
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor="#9ca3af" // Light gray color for the spinner
            colors={["#9ca3af"]} // For Android
            progressBackgroundColor="#18181b" // Dark background for the spinner
          />
        }
      >
        {isLoading && !history ? (
          <LoadingSkeleton />
        ) : isError ? (
          <>
            <View className="bg-zinc-900 rounded-xl p-6">
              <Text className="text-red-500 text-lg">
                Error: {error instanceof Error ? error.message : 'Failed to load history'}
              </Text>
              <Link href="/" asChild>
                <TouchableOpacity className="mt-4 bg-zinc-800 p-4 rounded-lg active:bg-zinc-700">
                  <Text className="text-white text-center">Return to Dashboard</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </>
        ) : (
          <>
            <View className="bg-zinc-900 rounded-xl p-6 mb-6">
              <Text className="text-white text-2xl font-bold mb-4">Plant Information</Text>
              <View className="space-y-2">
                <Text className="text-gray-400">Plant ID: 1</Text>
                <Text className="text-gray-400">Location: Living Room</Text>
                <Text className="text-gray-400">Type: Indoor Plant</Text>
              </View>
            </View>

            <View className="bg-zinc-900 rounded-xl p-6">
              <Text className="text-white text-2xl font-bold mb-4">
                Moisture History
                {isFetching && ' (Refreshing...)'}
              </Text>
              
              {history && history.length > 0 ? (
                <View className="space-y-4">
                  {[...history]
                    .sort((a, b) => b.id - a.id)
                    .map((reading) => (
                    <View key={reading.id} className="border-b border-zinc-800 pb-4">
                      <View className="flex-row justify-between items-center">
                        <Text className={`text-lg font-bold ${getMoistureStatus(reading.moisture).color}`}>
                          {reading.moisture}
                        </Text>
                        <Text className="text-gray-400">
                          {formatDate(reading.timestamp)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-gray-400">No history available</Text>
              )}
            </View>

            <Link href="/" className="mt-6 text-gray-400 text-center block">
              Back to Dashboard
            </Link>
          </>
        )}
      </ScrollView>
    </View>
  );
} 