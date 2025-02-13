export interface PlantData {
  id: number;
  moisture: number;
  timestamp: string;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const plantApi = {
  getCurrentData: async (): Promise<PlantData> => {
    const response = await fetch(`${API_URL}/SensorData`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: PlantData[] = await response.json();
    return data[data.length - 1]; // Return the latest reading
  },

  getHistory: async (): Promise<PlantData[]> => {
    const response = await fetch(`${API_URL}/SensorData`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }
}; 