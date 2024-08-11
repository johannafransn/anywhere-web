import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ApiService } from "@/utils/api-service";
import { Auth } from "@/utils/cookie-auth";

export function useGetUserById() {
  const [user, setUser] = useState<any | null>(null);
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
        const _user = await ApiService.getUserById(userId as string);
        setUser(_user);
        setError(null);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.userId]);

  return { user, loading, error, setUser };
}

export default useGetUserById;
