import axios from "axios";

export const ApiService = {
  authenticateUser: async function (authData: any) {
    const { data } = await axios.post(`/api/user/`, authData);
    return data;
  },

  getUserById: async function (userId: string) {
    const { data } = await axios.get(`/api/user/${userId}`);
    return data;
  },

  getUserByWalletAddress: async function (walletAddress: string) {
    console.log(`/api/user/wallet/${walletAddress}`, "request URL");
    const { data } = await axios.get(`/api/user/wallet/${walletAddress}`);
    return data;
  },

  getMeetups: async function () {
    const { data } = await axios.get(`/api/meetup/`);
    return data;
  },

  getMeetupsByUserId: async function (userId: string, isPastEvents: boolean) {
    const { data } = await axios.get(
      `/api/meetup/${userId}?isPastEvents=${isPastEvents}`
    );
    return data;
  },

  createMeetup: async function (meetup: any) {
    const { data } = await axios.post(`/api/meetup`, meetup);
    return data;
  },
};
