/* eslint-disable @next/next/no-img-element */
"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import useGetUserById from "@/hooks/useGetUserById";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UpcomingEvents } from "./components/UpcomingEvents";
import { cities } from "./discover/page";

export default function Home() {
  const router = useRouter();

  const { user } = useGetUserById();

  return (
    <div className="relative flex flex-col w-full space-y-8">
      <div className="flex">
        <h4 className=" font-normal text-8xl mr-2 w-4/5">
          Crowdsource your next in-person meetup
        </h4>
        <div className="mt-7 text-left">
          <p className="text-lg font-light mb-3">
            Get paid to host IRL meetups and let your guests earn by bringing a
            friend.
          </p>
          {/* TO DO: Change button to create meetup button */}
          <Link
            href={user ? "/create-meetup" : "/onboard"}
            className="py-3 px-5 text-sm w-fit flex gap-2 items-center bg-black-opacity-80 text-white font-light rounded-xl hover:bg-black-opacity-70 hover:scale-105 transition ease-in-out disabled:bg-black-opacity-30"
          >
            Propose New Meetup
          </Link>
        </div>
      </div>

      <UpcomingEvents />
      <br></br>
      <br></br>
      <div className="flex flex-row gap-4 justify-between mt-12 mb-12">
        {cities.map((city) => (
          <div
            key={city.name}
            className="relative w-[270px] h-[160px] rounded-lg overflow-hidden"
          >
            <img
              src={city.image}
              alt={`${city.name}, ${city.region}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <span className="bg-gray-100 text-black-opacity-70 top-[10px] left-[10px] absolute px-2 py-1 rounded-lg">
              {city.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
