import axios from "axios";
import { Auth } from "./cookie-auth";

export const ApiService = {
  authenticateUser: async function (authData: any) {
    const { data } = await axios.post(`/api/user/`, authData);
    return data;
  },

  getUserById: async function (userId: string) {
    const { data } = await axios.get(`/api/user/${userId}`);
    return data;
  },

  getMeetupById: async function (meetupId: string) {
    const { data } = await axios.get(`/meetup/${meetupId}?userId=${Auth.id}`);
    return data;
  },

  getUserByWalletAddress: async function (walletAddress: string) {
    const { data } = await axios.get(`/api/user/wallet/${walletAddress}`);
    return data;
  },

  getMeetups: async function () {
    const { data } = await axios.get(`/api/meetup?userId=${Auth.id}`);
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
