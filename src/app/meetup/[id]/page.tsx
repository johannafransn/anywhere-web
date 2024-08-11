"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/* TODO:

This page should have the following data/logic:

Display meetup info: name, time, date, location, 
Display creator info: Socials, name, bio
Number of guests that have signed up, and their names + avatar
If current Auth.id is 'isGuest' or not, based on that render 'reserve spot' or 'cancel' button
Handle 'reserve spot' logic, create endpoint for where Auth.id is added to the meetup.guests array and db

*/

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full md:w-4/5 ">
      <div className="flex flex-col text-center justify-center text-lg">
        <div className="flex flex-row justify-between">
          <p className="text-[30px] ">Meetup Details</p>
        </div>
      </div>
    </div>
  );
}
