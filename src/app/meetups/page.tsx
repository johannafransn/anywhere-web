"use client";

import { useGetUserMeetupsByUserId } from "@/hooks/useGetMeetupsByUserId";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function Dashboard() {
  const router = useRouter();
  const [isPastEvents, setIsPastEvents] = useState(false);
  const { meetups, loading } = useGetUserMeetupsByUserId(isPastEvents);

  const frameUrl = process.env.NEXT_PUBLIC_SERVER_URL + "frames-transaction/";

  const handleCopyClick = (text: string) => {
    // ... existing code ...
  };

  return (
    <div className="flex flex-col w-full md:w-3/5 mt-12 mx-auto">
      <div className="flex flex-col text-center justify-center text-lg">
        <div className="flex flex-row justify-between">
          <p className="text-[30px] ">Meetups</p>
          <div className="inline-flex rounded-md bg-gray-200 ">
            <button
              onClick={() => setIsPastEvents(false)}
              className={`px-4 py-2 w-32 rounded-md transition-colors duration-200 ${
                !isPastEvents
                  ? "bg-gray-300 text-black-opacity-80 m-1"
                  : "text-gray-700 hover:underline m-1"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setIsPastEvents(true)}
              className={`px-4 py-2 w-32 rounded-md transition-colors duration-200 ${
                isPastEvents
                  ? "bg-gray-300 text-black-opacity-80 m-1"
                  : "text-gray-700 hover:underline m-1"
              }`}
            >
              Past
            </button>
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-4xl mb-4">
            {isPastEvents ? "Past Meetups" : "Upcoming Meetups"}
          </h2>
          {loading ? (
            <div>Loading...</div>
          ) : meetups?.length > 0 ? (
            meetups.map((meetup: any) => (
              <div
                className="grid grid-cols-3 gap-2 text-black mt-3"
                key={meetup.id}
              >
                <div className="relative">
                  <img
                    src={meetup.image}
                    alt={meetup.name}
                    className=" object-cover rounded-lg w-[70px] h-[70px]"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold">{meetup.name}</h3>
                  <p className="text-sm">{meetup.description}</p>
                  <p className="text-sm">
                    Date: {new Date(meetup.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col gap-2 items-center">
              <h4 className="text-black-opacity-30 font-extra">
                Propose a meetup and make lifelong friends.
              </h4>
              <Link
                href="/create-meetup"
                className="py-3 px-5 text-sm flex gap-2 items-center bg-black-opacity-80 text-white font-light rounded-xl hover:bg-black-opacity-70 hover:scale-105 transition ease-in-out disabled:bg-black-opacity-30"
              >
                <FaPlus className="font-extralight" />
                Propose new meetup
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
