"use client";

import CreatorSidebar from "@/app/components/CreatorSidebar";
import ReserveSpot from "@/app/components/ReserveSpot";
import useGetMeetupById from "@/hooks/useGetMeetupById";
import { Auth } from "@/utils/cookie-auth";
import { useRouter } from "next/navigation";
import { LuMapPin } from "react-icons/lu";

/* TODO:

This page should have the following data/logic:

Display meetup info: name, time, date, location, 
Display creator info: Socials, name, bio
Number of guests that have signed up, and their names + avatar
If current Auth.id is 'isGuest' or not, based on that render 'reserve spot' or 'cancel' button
Handle 'reserve spot' logic, create endpoint for where Auth.id is added to the meetup.guests array and db

*/

export default function Meetup() {
  const router = useRouter();
  const { meetup, loading } = useGetMeetupById();

  console.log(meetup, "what smeetup?");

  return (
    <div className="flex flex-col w-full md:w-4/5  max-w-xl mx-auto ">
      <div className="flex flex-col  text-lg">
        <div className="flex flex-row">
          {meetup && <CreatorSidebar meetup={meetup} />}
          <div className="flex flex-col">
            {meetup && <p className="text-[40px]">{meetup.meetup.name}</p>}
            <div className="mt-4">
              <p>{meetup?.meetup.date}</p>
              <div className="flex flex-row mt-4 mb-4">
                {" "}
                <LuMapPin />{" "}
                <p className="-mt-1  ml-2">{meetup?.meetup.location}</p>
              </div>
            </div>
            {meetup && (
              <ReserveSpot
                isGuest={meetup.meetup.isGuest}
                price={meetup.meetup.attendanceFee}
                isOwner={meetup.creator.id === Auth.id}
                meetupId={meetup.meetup.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
