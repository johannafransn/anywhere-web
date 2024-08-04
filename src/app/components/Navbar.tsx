/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { Auth } from "@/utils/cookie-auth";
import { useDisconnect } from "wagmi";
import LoginButton from "./LoginButton";

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

  return (
    <nav className="flex justify-between pt-4 mb-24">
      <div className="flex justify-between text-lg w-100 space-x-4">
        <a className="flex flex-row text-[40px]" href="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="currentColor"
            className="bi bi-geo-alt -mt-2 mr-2"
            viewBox="0 0 16 16"
          >
            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
          </svg>{" "}
          Anywhere
        </a>
      </div>
      <div className="flex justify-between  flex-row">
        {" "}
        <a className="mr-3" href="/">
          How It Works
        </a>
        <a className="mr-3" href="/meetups">
          Meetups
        </a>{" "}
        <a href="/dashboard"> Discover</a>
      </div>
      {userSession ? (
        <div className="flex items-center flex-row">
          <a className="mr-1" href="/create-meetup">
            Propose a Meetup
          </a>
          <button className="mr-3" onClick={handleSignout}>
            Sign Out user: #{Auth.id}
          </button>
          <a href="/profile">My profile</a>
        </div>
      ) : (
        <LoginButton />
      )}
    </nav>
  );
};

export default Navbar;
