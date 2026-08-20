import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

/**
 * Fetch all food items (or optional query params)
 */
export const getFoods = async (params = {}) => {
  const response = await API.get("/foods", { params });
  return response.data;
};

/**
 * Fetch top priority USE FIRST food items
 * @param {number} limit - Number of top items to fetch (default: 5)
 */
export const getUseFirstFoods = async (limit = 5) => {
  const response = await API.get(`/foods/use-first?limit=${limit}`);
  return response.data;
};

export default API;
