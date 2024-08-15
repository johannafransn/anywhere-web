/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect } from "react";
import { Auth } from "@/utils/cookie-auth";
import { useAccount, useDisconnect } from "wagmi";
import LoginButton from "./LoginButton";
import { useUserSession } from "@/hooks/useUserSession";
import {
  LuFileQuestion,
  LuMapPin,
  LuShieldQuestion,
  LuTicket,
} from "react-icons/lu";
import { usePathname } from "next/navigation";
import Link from "next/link";
import useGetUserById from "@/hooks/useGetUserById";
import { FaPhotoFilm } from "react-icons/fa6";
import { MdOutlineExitToApp } from "react-icons/md";

const Navbar = () => {
  const { userSession, updateUserSession } = useUserSession();
  const { user } = useGetUserById();
  const { address, isConnected } = useAccount();
  const pathname = usePathname();

  const { disconnect } = useDisconnect();
  const handleSignout = () => {
    Auth.removeUser();
    updateUserSession(false);
    window.location.href = "/";
    disconnect();
  };

  useEffect(() => {}, [userSession]);

  const linkClass = (href: string) =>
    `flex items-center gap-2 transition ease-in-out hover:text-black ${
      pathname === href ? "text-gray-700" : "text-black-opacity-50"
    }`;

  return (
    <nav className="flex justify-between pt-4">
      <div className="flex justify-between text-lg w-100 space-x-4">
        <Link href="/" className="flex flex-row text-xl items-center gap-2">
          <LuMapPin />
          Anywhere
        </Link>
      </div>
      <div className="flex justify-between flex-row font-light items-center gap-5">
        {/* <Link href="/" className={linkClass("/")}>
          <LuFileQuestion />
          How It Works
        </Link> */}
        <Link href="/meetups" className={linkClass("/meetups")}>
          <LuTicket />
          Meetups
        </Link>
        <Link href="/discover" className={linkClass("/discover")}>
          Discover
        </Link>
      </div>
      {userSession || isConnected ? (
        <div className="flex items-center flex-row space-x-5 text-black-opacity-50">
          <Link href="/create-meetup">Propose New Meetup</Link>
          <button onClick={handleSignout}>
            <MdOutlineExitToApp />
          </button>
          <Link href={`/profile/${Auth.id}`}>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">
                  <FaPhotoFilm />
                </span>
              )}
            </div>
          </Link>
        </div>
      ) : (
        <LoginButton />
      )}
    </nav>
  );
};

export default Navbar;
