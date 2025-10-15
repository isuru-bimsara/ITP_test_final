import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/supplier-submissions'; // adjust backend URL

export const SupplierSubmissionAPI = {
  create: async (data, token) => {
    console.log('Creating supplier submission with data:', data);
    console.log('Using token:', token);

    const res = await axios.post(BASE_URL, data, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Create response:', res.data);
    return res.data;
  },

  getMySubmissions: async (token) => {
    console.log('Fetching my submissions with token:', token);

    const res = await axios.get(`${BASE_URL}/mine`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('My submissions response:', res.data);
    return res.data;
  },

  getAllSubmissions: async (token) => {
    console.log('Fetching all submissions (admin) with token:', token);

    const res = await axios.get(BASE_URL, { headers: { Authorization: `Bearer ${token}` } });
    console.log('All submissions response:', res.data);
    return res.data;
  },

  update: async (id, data, token) => {
    console.log(`Updating submission ${id} with data:`, data);
    console.log('Using token:', token);

    const res = await axios.put(`${BASE_URL}/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Update response:', res.data);
    return res.data;
  },

  delete: async (id, token) => {
    console.log(`Deleting submission with ID: ${id}`);
    console.log('Using token:', token);

    const res = await axios.delete(`${BASE_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Delete response:', res.data);
    return res.data;
  }
};
