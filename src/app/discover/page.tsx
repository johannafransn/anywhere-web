/* eslint-disable @next/next/no-img-element */
"use client";

import useGetAllMeetups from "@/hooks/useGetAllMeetups";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Dashboard() {
  const router = useRouter();
  const [frames, setFrames] = useState<any[]>([]);
  const { meetups, loading } = useGetAllMeetups();

  useEffect(() => {}, []);

  return (
    <div className="flex flex-col w-full md:w-4/5">
      <div className="flex flex-col text-center justify-center text-lg">
        <div className="mt-2 mb-3" role="status">
          <button
            onClick={() => router.push("/create-meetup")}
            className="bg-purple-600 text-white px-4 py-2 rounded-md"
          >
            Create a meetup
          </button>
        </div>
        Here is a dashboard with all meetups available
        <div className="flex flex-col space-y-4 p-2">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {meetups?.length ? (
              meetups.map((meetup: any, index: number) => (
                <div
                  onClick={() => router.push(`/meetup/${meetup.meetup.id}`)}
                  key={index}
                  className="h-auto max-w-full rounded-lg text-grey p-3 bg-zinc-300"
                >
                  <img
                    className="h-auto max-w-full rounded-lg mb-2"
                    src={meetup.meetup.image}
                    alt={meetup.meetup.name}
                  />
                  <h4 className="text-l font-semibold">{meetup.meetup.name}</h4>
                  <p className="text-xs font-bold">{meetup.meetup.country}</p>
                  <p className="text-xs">{meetup.meetup.description}</p>
                  <div className="text-xs flex flex-row">
                    Creator: {meetup.creator.name}
                    <div className="w-5 h-5 ml-1 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={meetup.creator.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />{" "}
                    </div>
                  </div>
                  <div className="text-xs flex flex-row">
                    {meetup?.isGuest ? "Confirmed" : "Not signed up yet"}
                  </div>
                </div>
              ))
            ) : (
              <p>No results found...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /*    <div
              className="grid grid-rows-3 gap-2 text-black mt-3"
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
            </div> */
}
