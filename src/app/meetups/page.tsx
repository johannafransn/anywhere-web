"use client";

import { useGetUserMeetupsByUserId } from "@/hooks/useGetMeetupsByUserId";
import { formatDate } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import SkeletonCard from "../components/SkeletonCard";

export default function Meetups() {
  const router = useRouter();
  const [isPastEvents, setIsPastEvents] = useState(false);
  const { meetups, loading } = useGetUserMeetupsByUserId(isPastEvents);

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
            {isPastEvents ? "Your Past Meetups" : "Your Upcoming Meetups"}
          </h2>
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div className="mb-4" key={index}>
                <SkeletonCard />
              </div>
            ))
          ) : meetups?.length > 0 ? (
            meetups.map((meetup: any) => (
              <div
                onClick={() => router.push(`/meetup/${meetup.id}`)}
                key={meetup.id}
                className="mb-4 h-auto w-full flex gap-4 rounded-lg text-black-opacity-80 cursor-pointer hover:bg-opacity-50 transition-opacity duration-300"
              >
                <img
                  className="h-20 w-20 rounded-lg shadow-sm object-cover"
                  src={meetup.image}
                  alt={meetup.name}
                />
                <div className="flex flex-col justify-between py-1 text-left text-sm">
                  <div className="flex gap-4">
                    <h4 className="font-medium">{meetup.name}</h4>
                    <p className="text-green-600">Confirmed</p>
                  </div>

                  <div className="flex items-center gap-2 text-black-opacity-60">
                    {/*     <img
                      src={meetup.creator.avatar}
                      alt="Avatar"
                      className="object-cover shadow-sm w-6 h-6 rounded-full"
                    />
                    Proposed by: {meetup.creator.name} */}
                  </div>
                  <div className="flex items-center text-black-opacity-50">
                    {/* Dummy data */}
                    <p>{formatDate(meetup.startDate)} </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col gap-2 items-center">
              <h4 className="text-black-opacity-30 font-extra">
                Propose a meetup and make lifelong friends.
              </h4>
              <button
                onClick={() => router.push("/create-meetup")}
                className="py-2 px-4 text-sm flex gap-2 items-center bg-black-opacity-80 text-white font-light rounded-xl hover:bg-black-opacity-70 hover:scale-105 transition ease-in-out disabled:bg-black-opacity-30"
              >
                <FaPlus className="h-3 w-3" />
                Create a meetup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
