import { startLogin } from "@/const";
import { authApi, clearAccessToken, getAccessToken, type ApiUser } from "@/api/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath } = options ?? {};
  const queryClient = useQueryClient();
  const meQuery = useQuery<ApiUser | null>({
    queryKey: ["auth", "me"],
    queryFn: async () => getAccessToken() ? authApi.me() : null,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch {} finally { clearAccessToken(); queryClient.setQueryData(["auth", "me"], null); }
  }, [queryClient]);

  const state = useMemo(() => {
    localStorage.setItem(
      "manus-runtime-user-info",
      JSON.stringify(meQuery.data)
    );
    return {
      user: meQuery.data ?? null,
      loading: meQuery.isLoading,
      error: meQuery.error ?? null,
      isAuthenticated: Boolean(meQuery.data),
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (redirectPath && window.location.pathname === redirectPath) return;

    window.location.href = redirectPath ?? "/login";
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    meQuery.isLoading,
    state.user,
  ]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
