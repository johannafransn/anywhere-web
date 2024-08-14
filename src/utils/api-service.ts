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
    console.log(`/meetup-get-by-id/${meetupId}?userId=${Auth.id}`, "url");
    const { data } = await axios.get(
      `/api/meetup-get-by-id/${meetupId}?userId=${Auth.id}`
    );
    console.log(data, "DATA ÖÖÖÖ");
    return data;
  },

  getUserByWalletAddress: async function (walletAddress: string) {
    console.log(`/api/user/wallet/${walletAddress}`, "url heej");
    const { data } = await axios.get(`/api/user/wallet/${walletAddress}`);
    return data;
  },

  getMeetups: async function () {
    const { data } = await axios.get(
      `/api/meetup-create-get?userId=${Auth.id}`
    );
    return data;
  },
  getMeetupsByUserId: async function (userId: string, isPastEvents: boolean) {
    const { data } = await axios.get(
      `/api/meetup-get-by-userid/${userId}?isPastEvents=${isPastEvents}`
    );
    return data;
  },

  createMeetup: async function (meetup: any) {
    const { data } = await axios.post(`/api/meetup-create-get`, meetup);
    return data;
  },
};
