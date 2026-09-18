"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Button, EmptyState } from "@/components/ui";
import { ROLES, ROUTES } from "@/constants";
import { useGetMeQuery } from "@/services/api/auth.api";
import { clearUser, setUser } from "@/store/authSlice";

function isStaffRole(role) {
  return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
}

function isAuthError(error) {
  return error?.status === 401 || error?.status === 403;
}

export function DashboardAuthGuard({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, error, isLoading, isError, isFetching, refetch } =
    useGetMeQuery();
  const sessionRejected = isError && isAuthError(error);

  useEffect(() => {
    if (data) {
      dispatch(setUser(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    // Only a rejected session (or a non-staff user) goes to login; network or
    // server errors keep the user here with a retry option.
    if (
      !isLoading &&
      !isFetching &&
      (sessionRejected || (!isError && data && !isStaffRole(data.role)))
    ) {
      dispatch(clearUser());
      router.replace(ROUTES.LOGIN);
    }
  }, [data, dispatch, isError, isFetching, isLoading, router, sessionRejected]);

  if (isLoading || isFetching) {
    return (
      <EmptyState
        title="Checking session..."
        description="Verifying your admin access."
      />
    );
  }

  if (isError && !sessionRejected) {
    return (
      <EmptyState
        title="Could not verify your session"
        description={
          error?.data?.message ||
          "The server could not be reached. Check your connection and try again."
        }
        action={
          <Button type="button" variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  if (isError || !data || !isStaffRole(data.role)) {
    return null;
  }

  return children;
}
