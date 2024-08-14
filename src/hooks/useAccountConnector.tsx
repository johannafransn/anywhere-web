"use client";
import { ApiService } from "@/utils/api-service";
import { useAccountEffect, useDisconnect } from "wagmi";
import { useUserSession } from "./useUserSession";
import { Auth } from "@/utils/cookie-auth";
import { useRouter } from "next/navigation";

export function useAccountConnector() {
  const { updateUserSession, userSession } = useUserSession();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  useAccountEffect({
    async onConnect(data) {
      console.log("Connected!", data);

      try {
        console.log(data.address, "data address 1");
        const existingUser = await ApiService.getUserByWalletAddress(
          data.address
        );
        console.log(existingUser, "exist user?");
        if (existingUser) {
          Auth.setUser(existingUser.id);
          updateUserSession(true);
          router.push(`/profile/${existingUser.id}`);
        } else {
          router.push(`/onboard/${data.address}`);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        disconnect();
      }
    },
    onDisconnect() {
      console.log("Disconnected");
      Auth.removeUser();
    },
  });
}
