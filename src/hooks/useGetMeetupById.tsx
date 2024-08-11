import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ApiService } from "@/utils/api-service";
import { Auth } from "@/utils/cookie-auth";

export function useGetMeetupById() {
  const [meetup, setMeetup] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      let userId = params.userId;
      if (!userId) {
        userId = Auth.id;
      }

      try {
        setLoading(true);
        const _user = await ApiService.getMeetupById(userId as string);
        setMeetup(_user);
        setError(null);
      } catch (error) {
        console.error("Error fetching meetup with id:", params.userId, error);
        setError("Failed to fetch meetup data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.userId]);

  return { meetup, loading, error, setMeetup };
}

export default useGetMeetupById;
