import { Button, Card } from "@/components/ui";
import { Field, TextSelect } from "../../../features/AdminFormFields";
import { EMPTY_FILTERS } from "./questionsAdminData";

export function QuestionsFilters({
  filters,
  setFilters,
  classes,
  filterBooks,
  filterChapters,
  shownCount,
  totalCount,
  hasActiveFilters,
}) {
  return (
    <Card className="border-neutral-200 bg-neutral-0 p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-caption font-semibold tracking-wide text-neutral-500 uppercase">
          Filters
        </p>
        <div className="flex items-center gap-3">
          <p className="text-caption text-neutral-500">
            Showing {shownCount} of {totalCount}
          </p>
          {hasActiveFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setFilters(EMPTY_FILTERS)}
            >
              Clear
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Field label="Class">
          <TextSelect
            value={filters.classId}
            onChange={(e) => {
              const classId = e.target.value;
              setFilters((prev) => ({
                ...prev,
                classId,
                bookId: "",
                chapterId: "",
              }));
            }}
          >
            <option value="">All classes</option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </TextSelect>
        </Field>

        <Field label="Book">
          <TextSelect
            value={filters.bookId}
            onChange={(e) => {
              const bookId = e.target.value;
              setFilters((prev) => ({
                ...prev,
                bookId,
                chapterId: "",
              }));
            }}
          >
            <option value="">All books</option>
            {filterBooks.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </TextSelect>
        </Field>

        <Field label="Chapter">
          <TextSelect
            value={filters.chapterId}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                chapterId: e.target.value,
              }))
            }
          >
            <option value="">All chapters</option>
            {filterChapters.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </TextSelect>
        </Field>

        <Field label="Question type">
          <TextSelect
            value={filters.type}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, type: e.target.value }))
            }
          >
            <option value="">All types</option>
            <option value="mcq">MCQs</option>
            <option value="short">Short</option>
            <option value="long">Long</option>
          </TextSelect>
        </Field>
      </div>
    </Card>
  );
}
