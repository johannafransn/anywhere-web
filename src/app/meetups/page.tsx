"use client";

import { useGetUserMeetupsByUserId } from "@/hooks/useGetMeetupsByUserId";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [isPastEvents, setIsPastEvents] = useState(false);
  const { meetups, loading } = useGetUserMeetupsByUserId(isPastEvents);

  const frameUrl = process.env.NEXT_PUBLIC_SERVER_URL + "frames-transaction/";

  const handleCopyClick = (text: string) => {
    // ... existing code ...
  };

  return (
    <div className="flex flex-col w-full md:w-4/5 ">
      <div className="flex flex-col text-center justify-center text-lg">
        <div className="flex flex-row justify-between">
          <p className="text-[30px] ">Meetups</p>
          <div className="inline-flex w-[180px] rounded-md bg-gray-200 ">
            <button
              onClick={() => setIsPastEvents(false)}
              className={`px-4 py-2 rounded-l-md transition-colors duration-200 ${
                !isPastEvents
                  ? "bg-gray-400 text-white"
                  : "text-gray-700 hover:bg-gray-300"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setIsPastEvents(true)}
              className={`px-4 py-2 rounded-r-md transition-colors duration-200 ${
                isPastEvents
                  ? "bg-gray-400 text-white"
                  : "text-gray-700 hover:bg-gray-300"
              }`}
            >
              Past
            </button>
          </div>
        </div>

        <div className="mt-24">
          <h2>{isPastEvents ? "Past Meetups" : "Upcoming Meetups"}</h2>
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
            <div>No meetups available</div>
          )}
        </div>
      </div>
    </div>
  );
}
