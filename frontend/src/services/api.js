import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getPatientData = async () => {
  try {
    const response = await axios.get(`${API_URL}/patient`);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient data:", error);
    throw error;
  }
};
