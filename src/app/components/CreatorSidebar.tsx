"use client";
import { useRouter } from "next/navigation";

export default function CreatorSidebar(props: any) {
  const { meetup } = props;
  const router = useRouter();

  return (
    <div className="flex flex-col w-64">
      <img
        className="rounded-lg w-[250px] h-[250px] object-cover shadow-xs shadow-gray-400 dark:shadow-gray-400"
        src={meetup.meetup.image}
        alt="meetup image"
      />
      {/* Avatar and Proposed By */}
      <div className="flex flex-row mt-4 space-x-2">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex  overflow-hidden">
          <img
            src={meetup.creator.avatar}
            alt="Avatar"
            className="w-full h-full object-cover shadow-xl dark:shadow-gray-800"
          />
        </div>
        <div className="flex flex-col mb-4 justify-start">
          {" "}
          <p className="text-xs text-black-opacity-40">Proposed by</p>{" "}
          <p>{meetup.creator.name}</p>
        </div>
      </div>

      {/* Creator bio */}
      <div className="space-y-2">
        <p>{meetup.creator.bio}</p>

        {/* Number of attendees */}
        <p className="text-sm text-black-opacity-40">
          {meetup.guestCount} going
        </p>
        <hr />
        {/* Attendee avatars */}
        <div className="flex space-x-2">
          {meetup.guests.map((guest: any) => (
            <div
              key={guest.id}
              className="w-10 h-10 rounded-full bg-gray-200 cursor-pointer overflow-hidden hover:scale-105"
            >
              <img
                src={guest.avatar}
                alt="Avatar"
                className="w-full h-full object-cover shadow-sm dark:shadow-gray-800"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
