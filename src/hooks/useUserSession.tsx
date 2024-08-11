import { useState, useEffect } from "react";

export function useUserSession() {
  const [userSession, setUserSession] = useState(false);

  useEffect(() => {
    // check auth status on mount and whenever Auth.id changes
    //setUserSession(!!Auth.id);
  }, [userSession]);

  const updateUserSession = (isLoggedIn: boolean) => {
    setUserSession(isLoggedIn);
  };

  return { userSession, updateUserSession };
}
