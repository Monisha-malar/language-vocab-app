import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL =
  Platform.OS === 'web'
    ? 'http://127.0.0.1:8000'       // for browser
    : 'http://10.70.23.172:8000';  // your PC IP, same network as phone

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});








