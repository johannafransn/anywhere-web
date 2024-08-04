import { ApiService } from "@/utils/api-service";
import { Auth } from "@/utils/cookie-auth";
import { useState, useEffect } from "react";

export function useGetUserMeetupsByUserId(isPastEvents: boolean) {
  const [meetups, setMeetups] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = Auth.id;
        const _meetups = await ApiService.getMeetupsByUserId(
          userId,
          isPastEvents
        );
        setMeetups(_meetups);
        setLoading(false);
      } catch (error) {
        console.log(error, "Error fetching the meetups");
        setLoading(false);
      }
    };
    fetchData();
  }, [isPastEvents]);

  return { meetups, loading, setMeetups };
}

export default useGetUserMeetupsByUserId;
