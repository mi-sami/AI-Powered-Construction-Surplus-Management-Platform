import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

/**
 * Common Dynamic API Action Handler
 * @param {Object} options
 * @param {string} options.action - 'ADD' | 'EDIT' | 'DELETE' | 'GET'
 * @param {string} options.target - 'users' | 'listings' | 'orders' | 'requirements'
 * @param {Object} [options.payload] - Data object (Must include 'id' for EDIT/DELETE)
 */
export const handleApiAction = async ({ action, target, payload = {} }) => {
  try {
    const uppercaseAction = action.toUpperCase();

    // 1. ADD Action (POST -> BASE_URL/target)
    if (uppercaseAction === 'ADD') {
      const response = await axios.post(`${BASE_URL}/${target}`, payload);
      return response.data;
    }

    // 2. EDIT / UPDATE Action (PATCH -> BASE_URL/target/id)
    if (uppercaseAction === 'EDIT' || uppercaseAction === 'UPDATE') {
      if (!payload.id) throw new Error('ID is required for EDIT action!');
      const response = await axios.patch(`${BASE_URL}/${target}/${payload.id}`, payload);
      return response.data;
    }

    // 3. DELETE Action (DELETE -> BASE_URL/target/id)
    if (uppercaseAction === 'DELETE') {
      if (!payload.id) throw new Error('ID is required for DELETE action!');
      const response = await axios.delete(`${BASE_URL}/${target}/${payload.id}`);
      return response.data;
    }

    // 4. GET Action (GET -> BASE_URL/target or BASE_URL/target/id)
    if (uppercaseAction === 'GET') {
      const url = payload.id ? `${BASE_URL}/${target}/${payload.id}` : `${BASE_URL}/${target}`;
      const response = await axios.get(url);
      return response.data;
    }

    throw new Error('Invalid Action Type!');
  } catch (error) {
    console.error(`API Handler Error [${action} on ${target}]:`, error);
    throw error;
  }
};