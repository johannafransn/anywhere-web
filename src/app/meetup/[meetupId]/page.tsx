"use client";

import CreatorSidebar from "@/app/components/CreatorSidebar";
import ReserveSpot from "@/app/components/ReserveSpot";
import useGetMeetupById from "@/hooks/useGetMeetupById";
import { Auth } from "@/utils/cookie-auth";
import { useRouter } from "next/navigation";
import { LuMapPin } from "react-icons/lu";

export default function Meetup() {
  const router = useRouter();
  const { meetup, loading } = useGetMeetupById();

  return (
    <div className="flex flex-col w-3/5 mx-auto">
      <div className="flex flex-col text-md">
        <div className="flex space-x-5">
          {/* Creator details, attendees and event picture */}
          {meetup && <CreatorSidebar meetup={meetup} />}

          {/* Event details */}
          <div className="flex flex-col space-y-6 w-2/5">
            {meetup && (
              <p className="text-4xl text-black-opacity-80">
                {meetup.meetup.name}
              </p>
            )}
            <div>
              <p>{meetup?.meetup.date}</p>
              <div className="flex items-center">
                <div className="border border-black-opacity-60 rounded-md p-2">
                  <LuMapPin />
                </div>{" "}
                <p className="-mt-1 ml-2">{meetup?.meetup.location}</p>
              </div>
            </div>

            {/* Place to reserve */}
            {meetup && (
              <ReserveSpot
                isGuest={meetup.isGuest}
                price={meetup.meetup.attendanceFee}
                isOwner={meetup.creator.id === Auth.id}
                meetupId={meetup.meetup.id}
                ownerAddress={meetup.meetup.organizerWalletAddress}
              />
            )}

            {/* More about the event */}
            <div className="flex flex-col space-y-2">
              <h4 className="text-black-opacity-40">About the event</h4>
              <hr />
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
