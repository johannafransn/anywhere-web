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
    const { data } = await axios.get(
      `/api/meetup-get-by-id/${meetupId}?userId=${Auth.id}`
    );
    return data;
  },

  getUserByWalletAddress: async function (walletAddress: string) {
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

  createGuest: async function (guest: any) {
    const { data } = await axios.post(`/api/reserve-guest-spot`, guest);
    return data;
  },
  withdrawUserEscrowedFunds: async function (
    organizerAddress: string,
    eventId: number,
    userAddress: string
  ) {
    const { data } = await axios.post(`/api/withdraw-user-escrowed-funds`, {
      organizerAddress,
      eventId,
      userAddress,
    });
    return data;
  },
};
