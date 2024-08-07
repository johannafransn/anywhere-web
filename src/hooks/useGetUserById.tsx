import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ApiService } from "@/utils/api-service";

export function useGetUserById() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const userId = params.userId;
      if (!userId) {
        setError("User ID not found in URL");
        return;
      }

      try {
        setLoading(true);
        const _user = await ApiService.getUserById(userId);
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
