import { ApiService } from "@/utils/api-service";
import { Auth } from "@/utils/cookie-auth";
import { useState, useEffect } from "react";

export function useGetMeetupsByUserId() {
  //TODO fix types
  const [userMeetups, setUserMeetups] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userMeetups) {
          setLoading(true);
          const _meetups = await ApiService.getMeetupsByUserId(Auth.id);
          setUserMeetups(_meetups);
          setLoading(false);
        }
      } catch (error) {
        console.log(error, "Error fetching the meetups for userId:" + Auth.id);
      }
    };
    fetchData();
  }, [userMeetups]);

  return { userMeetups, loading, setUserMeetups };
}

export default useGetMeetupsByUserId;
