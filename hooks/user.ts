import useSWR from "swr";
import { User } from "../types/main";
import { fetcher } from "../util/fetcher";

/**
 * This is a hook for react components to access the user's auth state
 * /api/me checks for a session cookie and says who u are or 400s
 */
export const useUser = () => {
  const { data: user, mutate, error } = useSWR<User>("/api/me", fetcher);

  return { user, mutate, error };
};
