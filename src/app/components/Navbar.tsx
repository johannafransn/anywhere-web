/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { Auth } from "@/utils/cookie-auth";
import { useDisconnect } from "wagmi";
import LoginButton from "./LoginButton";
import { useUserSession } from "@/hooks/useUserSession";
import {
  LuFileQuestion,
  LuMapPin,
  LuShieldQuestion,
  LuTicket,
} from "react-icons/lu";

const Navbar = () => {
  const { userSession, updateUserSession } = useUserSession();
  const { disconnect } = useDisconnect();
  const handleSignout = () => {
    disconnect();
    Auth.removeUser();
    updateUserSession(false);
    window.location.href = "/";
  };

  return (
    <nav className="flex justify-between pt-4">
      <div className="flex justify-between text-lg w-100 space-x-4">
        <a className="flex flex-row text-xl items-center gap-2" href="/">
          <LuMapPin />
          Anywhere
        </a>
      </div>
      <div className="flex justify-between flex-row font-light text-black-opacity-50 items-center gap-5">
        {" "}
        <a
          className="flex items-center gap-2 transition ease-in-out hover:text-black"
          href="/"
        >
          <LuFileQuestion />
          How It Works
        </a>
        <a
          className="flex items-center gap-2 transition ease-in-out hover:text-black"
          href="/meetups"
        >
          <LuTicket />
          Meetups
        </a>{" "}
        <a
          className="transition ease-in-out hover:text-black"
          href="/dashboard"
        >
          {" "}
          Discover
        </a>
      </div>
      {userSession ? (
        <div className="flex items-center flex-row">
          <a className="mr-1" href="/create-meetup">
            Propose a Meetup
          </a>
          <button className="mr-3" onClick={handleSignout}>
            Sign Out user: #{Auth.id}
          </button>
          <a href={`/profile/${Auth.id}`}>My profile</a>
        </div>
      ) : (
        <LoginButton />
      )}
    </nav>
  );
};

export default Navbar;
