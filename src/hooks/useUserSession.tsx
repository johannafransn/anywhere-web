import { useState, useEffect } from "react";
import { Auth } from "@/utils/cookie-auth";
import { useAccount } from "wagmi";

export function useUserSession() {
  const [userSession, setUserSession] = useState(false);

  console.log("USERSSESSION IN hook:", Auth.id, userSession);
  useEffect(() => {
    // check auth status on mount and whenever Auth.id changes
    //setUserSession(!!Auth.id);
  }, [userSession]);

  const updateUserSession = (isLoggedIn: boolean) => {
    setUserSession(isLoggedIn);
  };

  return { userSession, updateUserSession };
}
