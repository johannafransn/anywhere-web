/* eslint-disable @next/next/no-img-element */
"use client";

import useGetAllMeetups from "@/hooks/useGetAllMeetups";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Dashboard() {
  const router = useRouter();
  const [frames, setFrames] = useState<any[]>([]);
  const { userMeetups, loading } = useGetAllMeetups();
  console.log(userMeetups, "usermeetups");
  useEffect(() => {}, []);

  const frameUrl = process.env.NEXT_PUBLIC_SERVER_URL + "frames-transaction/";

  const handleCopyClick = (text: string) => {
    navigator.clipboard
      .writeText(frameUrl + text)
      .then(() => {
        toast("Success! Link was copied.");
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
        toast("Copying the link failed. Try again.");
      });
  };
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
  );
}
