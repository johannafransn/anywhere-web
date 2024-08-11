/* eslint-disable @next/next/no-img-element */
"use client";

import useGetAllMeetups from "@/hooks/useGetAllMeetups";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const userMeetups = [
  {
    id: 1,
    name: "Jojos Meetup",
    description: "The best meetup in town",
    image: "",
    date: "12 August 2024, 12:30PM",
    country: "Mexico",
    city: "Tulum",
  },
  {
    id: 1,
    name: "Jojos Meetup",
    description: "The best meetup in town",
    image: "",
    date: "12 August 2024, 12:30PM",
    country: "Mexico",
    city: "Tulum",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [frames, setFrames] = useState<any[]>([]);
  /*   const { userMeetups, loading } = useGetAllMeetups();
   */ useEffect(() => {}, []);

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
        {userMeetups?.length > 0 ? (
          userMeetups?.map((meetup: any) => (
            <div className="flex flex-col col-span-2" key={meetup.id}>
              hej
            </div>
          ))
        ) : (
          <div>No meetups available</div>
        )}
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
