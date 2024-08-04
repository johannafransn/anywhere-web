/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { Auth } from "@/utils/cookie-auth";
import { useDisconnect } from "wagmi";

const Navbar = () => {
  const [userSession, setUserSession] = useState(false);
  const { disconnect } = useDisconnect();
  const handleSignout = () => {
    disconnect();
    Auth.removeUser();
    window.location.href = "/";
  };
  useEffect(() => {
    if (Auth.id) {
      setUserSession(true);
    }
  }, [userSession]);

  console.log(userSession, Auth.id);

  return (
    <nav className="flex justify-between pt-4">
      <div className="flex justify-between text-lg w-100 space-x-4">
        <a href="/">
          Logo goes here
          {/*  <img
            src=""
            width="100%"
            alt="Logo"
          /> */}
        </a>
      </div>
      {userSession ? (
        <div className="flex items-center">
          <button onClick={handleSignout}>Sign Out user: #{Auth.id}</button>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
