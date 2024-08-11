"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
