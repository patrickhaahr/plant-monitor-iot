import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { plantApi, PlantData } from '../services/api';
import '../global.css';

export default function Profile() {
  const { 
    data: history,
    isLoading,
    isError
  } = useQuery<PlantData[]>({
    queryKey: ['plantHistory'],
    queryFn: plantApi.getHistory,
  });

  const getMoistureStatus = (moisture: number) => {
    if (moisture < 500) return { text: 'Low', color: 'text-red-500' };
    if (moisture < 800) return { text: 'Medium', color: 'text-yellow-500' };
    return { text: 'Good', color: 'text-green-500' };
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView className="p-6">
        <View className="bg-zinc-900 rounded-xl p-6 mb-6">
          <Text className="text-white text-2xl font-bold mb-4">Plant Information</Text>
          <View className="space-y-2">
            <Text className="text-gray-400">Plant ID: 1</Text>
            <Text className="text-gray-400">Location: Living Room</Text>
            <Text className="text-gray-400">Type: Indoor Plant</Text>
          </View>
        </View>

        <View className="bg-zinc-900 rounded-xl p-6">
          <Text className="text-white text-2xl font-bold mb-4">Moisture History</Text>
          
          {isLoading ? (
            <Text className="text-gray-400 text-lg">Loading history...</Text>
          ) : isError ? (
            <Text className="text-red-500 text-lg">Error loading history</Text>
          ) : history && history.length > 0 ? (
            <View className="space-y-4">
              {history.map((reading) => (
                <View key={reading.timestamp} className="border-b border-zinc-800 pb-4">
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
      </ScrollView>
    </View>
  );
} 