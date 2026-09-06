"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { EmptyState } from "@/components/ui";
import { ROLES, ROUTES } from "@/constants";
import { useGetMeQuery } from "@/services/api/auth.api";
import { clearUser, setUser } from "@/store/authSlice";

function isStaffRole(role) {
  return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
}

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
    if (!isLoading && !isFetching && (isError || (data && !isStaffRole(data.role)))) {
      dispatch(clearUser());
      router.replace(ROUTES.LOGIN);
    }
  }, [data, dispatch, isError, isFetching, isLoading, router]);

  if (isLoading || isFetching) {
    return (
      <EmptyState
        title="Checking session..."
        description="Verifying your admin access."
      />
    );
  }

  if (isError || !data || !isStaffRole(data.role)) {
    return null;
  }

  return children;
}
