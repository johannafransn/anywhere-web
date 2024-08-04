import { ApiService } from "@/utils/api-service";
import { Auth } from "@/utils/cookie-auth";
import { useState, useEffect } from "react";

export function useGetAllMeetups() {
  //TODO fix types
  const [meetups, setMeetups] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!meetups) {
          setLoading(true);
          const _meetups = await ApiService.getMeetups();
          setMeetups(_meetups);
          setLoading(false);
        }
      } catch (error) {
        console.log(error, "Error fetching the meetups");
      }
    };
    fetchData();
  }, [meetups]);

  return { userMeetups: meetups, loading, setMeetups };
}

export default useGetAllMeetups;
