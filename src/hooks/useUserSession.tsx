import { useState, useEffect } from "react";
import { Auth } from "@/utils/cookie-auth";

export function useUserSession() {
  const [userSession, setUserSession] = useState(false);

  useEffect(() => {
    // check auth status on mount and whenever Auth.id changes
    setUserSession(!!Auth.id);
  }, []);

  const updateUserSession = (isLoggedIn: boolean) => {
    setUserSession(isLoggedIn);
  };

  return { userSession, updateUserSession };
}
