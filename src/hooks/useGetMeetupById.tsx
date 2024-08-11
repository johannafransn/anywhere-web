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
      let meetupId = params.meetupId;
      if (!meetupId) {
        throw Error("No meetupId provided");
      }

      try {
        setLoading(true);
        const _meetup = await ApiService.getMeetupById(meetupId as string);
        setMeetup(_meetup);
        setError(null);
      } catch (error) {
        console.error("Error fetching meetup with id:", meetupId, error);
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
