"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { EmptyState } from "@/components/ui";
import { ROUTES } from "@/constants";
import { useGetMeQuery } from "@/services/api/auth.api";
import { clearUser, setUser } from "@/store/authSlice";

export function DashboardAuthGuard({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading, isError, isFetching } = useGetMeQuery();

  useEffect(() => {
    if (data) {
      dispatch(setUser(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!isLoading && !isFetching && isError) {
      dispatch(clearUser());
      router.replace(ROUTES.LOGIN);
    }
  }, [dispatch, isError, isFetching, isLoading, router]);

  if (isLoading || isFetching) {
    return (
      <EmptyState
        title="Checking session..."
        description="Verifying your admin access."
      />
    );
  }

  if (isError || !data) {
    return null;
  }

  return children;
}
