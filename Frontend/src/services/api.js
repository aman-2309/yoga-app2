import axios from "axios";

// Configure base URL for the backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000, // 30 seconds timeout
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            // Server responded with error
            console.error("API Error:", error.response.data);
            throw new Error(
                error.response.data.message ||
                    error.response.data.detail ||
                    "An error occurred"
            );
        } else if (error.request) {
            // Request made but no response
            console.error("Network Error:", error.message);
            throw new Error(
                "Network error. Please check your connection and ensure the backend server is running."
            );
        } else {
            // Something else happened
            console.error("Error:", error.message);
            throw new Error(error.message);
        }
    }
);

export default apiClient;
export { API_BASE_URL };
