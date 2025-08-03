
import axios from 'axios';


const BASE_URL = 'http://localhost:5130';


export const fetchGoogleConnectUrl = async () => {
  const response = await axios.get(`${BASE_URL}/api/google/connect`);
  return response.data;
};


export const fetchGoogleAccountSessions = async () => {
  const response = await axios.get(`${BASE_URL}/api/google/session`);
  return response.data;
};


export const fetchGoogleAccountInbox = async (userId: string) => {
  const response = await axios.get(`${BASE_URL}/api/ginbox/inbox?userId=${userId}&maxResults=10`);
  return response.data;
};


export const postGoogleOAuthCode = async (code: string) => {
  const response = await axios.get(`${BASE_URL}/api/google/callback?code=${code}`);
  return  response.data;
};
