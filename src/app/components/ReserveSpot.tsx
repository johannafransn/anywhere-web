"use client";

import { useRouter } from "next/navigation";

export default function ReserveSpot(props: any) {
  const { meetup: meetupId } = props;
  const router = useRouter();

  console.log(meetupId, "MeetupID?");

  return (
    <div className="bg-slate-100 w-full rounded-lg border border-gray-400  p-4">
      Reserve spot
    </div>
  );
}
