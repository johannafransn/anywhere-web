/* eslint-disable @next/next/no-img-element */
"use client";

import useGetAllMeetups from "@/hooks/useGetAllMeetups";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CityCard from "../components/CityCard";
import { formatDate } from "@/utils/helpers";
import SkeletonCard from "../components/SkeletonCard";

export type City = {
  image: string;
  name: string;
  meetupsHosted: number;
  region: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [frames, setFrames] = useState<any[]>([]);
  const { meetups, loading } = useGetAllMeetups();

  const cities = [
    {
      image: "https://i.ibb.co/JxR4MQ9/madrid.jpg",
      name: "Madrid",
      meetupsHosted: 5,
      region: "Europe",
    },
    {
      image: "https://i.ibb.co/C6ftX09/chiang-mai.jpg",
      name: "Chiang Mai",
      meetupsHosted: 6,
      region: "Asia",
    },
    {
      image: "https://i.ibb.co/hWcNTVW/new-york.jpg",
      name: "New York",
      meetupsHosted: 18,
      region: "North America",
    },
    {
      image: "https://i.ibb.co/7Jxt7dm/Rectangle-3.png",
      name: "Mexico City",
      meetupsHosted: 2,
      region: "South America",
    },
  ];

  useEffect(() => {}, []);

  return (
    <div className="flex flex-col w-full mx-auto items-center md:w-4/5">
      <div className="flex flex-col text-center justify-center">
        <div className="mt-2 mb-7 text-left" role="status">
          <h3 className="text-2xl font-medium mb-2  ">Upcoming</h3>
          <p className="text-sm text-black-opacity-60">
            Get a pulse on all events happening around the world.
          </p>
        </div>
        <div className="flex flex-col space-y-4 p-2">
          <div className="grid grid-cols-2 gap-8">
            {meetups?.length
              ? meetups.map((meetup: any, index: number) => (
                  <div
                    onClick={() => router.push(`/meetup/${meetup.meetup.id}`)}
                    key={index}
                    className="h-auto w-full flex gap-4 rounded-lg text-black-opacity-80 cursor-pointer hover:bg-opacity-50 transition-opacity duration-300"
                  >
                    <img
                      className="h-20 w-20 rounded-lg shadow-sm object-cover"
                      src={meetup.meetup.image}
                      alt={meetup.meetup.name}
                    />
                    <div className="flex flex-col justify-between py-1 text-left text-sm">
                      <div className="flex gap-4">
                        <h4 className="font-medium">{meetup.meetup.name}</h4>
                        <p
                          className={`${
                            meetup.isGuest
                              ? "text-green-600"
                              : "text-black-opacity-30"
                          }`}
                        >
                          {meetup.isGuest ? "Confirmed" : "Pending"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-black-opacity-60">
                        <img
                          src={meetup.creator.avatar}
                          alt="Avatar"
                          className="object-cover shadow-sm w-6 h-6 rounded-full"
                        />
                        Proposed by: {meetup.creator.name}
                      </div>
                      <div className="flex items-center text-black-opacity-50">
                        {/* Dummy data */}
                        <p>{formatDate(meetup.meetup.startDate)} </p>

                        {/* This is where the meetup address and date will go */}
                      </div>
                    </div>
                  </div>
                ))
              : Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
          </div>
        </div>

        {/* Map all cities */}
        <div className="mt-2 mb-7 text-left">
          <h3 className="text-2xl font-medium mt-16 mb-2">Cities</h3>
          <p className="text-sm text-black-opacity-60">
            Pick a city. Any city.
          </p>
        </div>

        <div className="flex flex-col space-y-4 p-2">
          <div className="grid grid-cols-2 gap-8">
            {cities.map((city, index) => (
              <CityCard key={index} city={city} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
