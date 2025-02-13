import mockData from './get_sensor_data.json';

export interface PlantData {
  id: number;
  moisture: number;
  timestamp: string;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const plantApi = {
  getCurrentData: async (): Promise<PlantData> => {
    await delay(500); // Simulate network delay
    return mockData[mockData.length - 1]; // Return the latest reading
  },

  getHistory: async (): Promise<PlantData[]> => {
    await delay(500); // Simulate network delay
    return mockData;
  }
}; 