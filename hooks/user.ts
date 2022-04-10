import useSWR from "swr";
import { User } from "../types/main";
import { fetcher } from "../util/fetcher";

export const useUser = () => {
  const { data: user, mutate, error } = useSWR<User>("/api/me", fetcher);

  console.log(user);
  return { user, mutate, error };
};
