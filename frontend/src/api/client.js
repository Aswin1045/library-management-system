import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:9090/api',
  withCredentials: true, // Crucial for sending/receiving the JSESSIONID cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
