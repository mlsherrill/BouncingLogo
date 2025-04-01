import { useMemo } from "react";

export function useQuery() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const query: Record<string, string> = {};
    params.forEach((value, key) => {
      query[key] = value;
    });
    return query;
  }, []);
}
