"use client";
import useGetUserById from "@/hooks/useGetUserById";
// import { useWeb3Modal } from "@web3modal/wagmi/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CiCalendar } from "react-icons/ci";
import { FaChevronDown, FaXTwitter } from "react-icons/fa6";
import { SiFarcaster } from "react-icons/si";

export default function Home() {
  const router = useRouter();
  const { user, loading, error } = useGetUserById();

  return (
    <div className="relative flex flex-col w-full md:w-4/5 items-center mx-auto justify-center">
      <div className="mt-12 flex flex-col space-y-7">
        <div className="flex">
          {/* Profile Avatar */}
          <div className="mr-5">
            <Image
              src={user?.avatar}
              alt={user?.name}
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>

          {/* Profile Info */}
          <div className="text-left p-2 space-y-2">
            <h2
              className="text-xl text-black-opacity-80 leading-normal capitalize tracking-tight mb-3"
              style={{ fontSize: 30, lineHeight: 1 }}
            >
              {user?.name}
            </h2>
            <h4 className="text-md leading-normal tracking-tight">
              {user?.bio}
            </h4>
            <div className="text-sm text-black-opacity-50 flex space-x-2 items-center">
              <CiCalendar />
              <span>Joined August 2024</span>
            </div>
            <div className="flex space-x-3">
              <div className="text-sm text-black-opacity-50 space-x-1">
                <span className="font-medium text-black-opacity-70">5</span>
                <span>Hosted</span>
              </div>
              <div className="text-sm text-black-opacity-50 space-x-1">
                <span className="font-medium text-black-opacity-70">3</span>
                <span>Attended</span>
              </div>
              <div className="text-sm text-black-opacity-50 space-x-1">
                <span className="font-medium text-black-opacity-70">12</span>
                <span>Referrals</span>
              </div>
            </div>
            <div>
              {user?.xcom && (
                <Link href={user.xcom}>
                  <FaXTwitter />
                </Link>
              )}
              {user?.farcaster && (
                <Link href={user.farcaster}>
                  <SiFarcaster />
                </Link>
              )}
            </div>
          </div>

          {/* Profile earnings */}
          <div>
            <h4>0.006ETH</h4>
            <p>Total Revenue</p>
          </div>
        </div>

        <hr />

        <div className="flex w-full justify-between">
          <h4 className="text-lg">Past Events:</h4>
          <div className="flex text-sm text-black-opacity-50 py-2 px-4 gap-2 bg-gray-200 items-center rounded-xl justify-center">
            <p>All</p>
            <FaChevronDown />
          </div>
        </div>
      </div>
    </div>
  );
}
