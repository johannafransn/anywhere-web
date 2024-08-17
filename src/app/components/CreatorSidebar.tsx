"use client";

import { useRouter } from "next/navigation";

export default function CreatorSidebar(props: any) {
  const { meetup } = props;
  const router = useRouter();

  return (
    <div className="flex flex-col mr-12 ">
      <img
        className="rounded-lg w-[200px] h-[200px] mx-auto object-cover shadow-md shadow-gray-400 dark:shadow-gray-400"
        src={meetup.meetup.image}
        alt="meetup image"
      />
      <div className="flex flex-row mt-4">
        {" "}
        <div className=" w-10 h-10 ml-5 rounded-full bg-gray-200 flex  overflow-hidden">
          <img
            src={meetup.creator.avatar}
            alt="Avatar"
            className="w-full h-full object-cover shadow-xl dark:shadow-gray-800"
          />
        </div>
        <div className="flex flex-col mb-4 justify-start">
          {" "}
          <p className="text-xs">Proposed by</p> <p>{meetup.creator.name}</p>
        </div>
      </div>
      <div className="">
        <p>{meetup.creator.bio}</p>
        <p>{meetup.guestCount} Going</p>
        {meetup.guests.map((guest: any) => (
          <div
            key={guest.id}
            className=" w-10 h-10 ml-5 rounded-full bg-gray-200 flex  overflow-hidden"
          >
            <img
              src={guest.avatar}
              alt="Avatar"
              className="w-full h-full object-cover shadow-xl dark:shadow-gray-800"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
