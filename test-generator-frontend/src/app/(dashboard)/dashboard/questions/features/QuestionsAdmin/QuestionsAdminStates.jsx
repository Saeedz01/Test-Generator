import { EmptyState } from "@/components/ui";

export function QuestionsAdminLoading() {
  return (
    <EmptyState
      title="Loading questions..."
      description="Fetching question bank from the server."
    />
  );
}

export function QuestionsAdminError({ error, onRetry }) {
  return (
    <EmptyState
      title="Could not load questions"
      description={
        error?.data?.message ||
        error?.error ||
        "Check that the backend is running, then try again."
      }
      action={
        <button
          type="button"
          className="text-small font-semibold text-primary-700"
          onClick={onRetry}
        >
          Retry
        </button>
      }
    />
  );
}
