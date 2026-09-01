import { Button } from "@/components/ui";
import { Field, TextSelect, TextTextarea } from "../../../features/AdminFormFields";
import { McqOptionsFields } from "./McqOptionsFields";

export function QuestionsFormFields({
  form,
  setForm,
  classes,
  books,
  chapters,
  booksForClass,
  chaptersForBook,
  editing,
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  const updateMcqOption = (index, value) => {
    setForm((current) => {
      const nextOptions = [...(current.options || ["", "", "", ""])];
      nextOptions[index] = value;
      return { ...current, options: nextOptions };
    });
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Field label="Statement">
        <TextTextarea
          value={form.statement}
          onChange={(e) =>
            setForm((f) => ({ ...f, statement: e.target.value }))
          }
          required
        />
      </Field>

      <Field label="Question type">
        <TextSelect
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          disabled={Boolean(editing)}
        >
          <option value="mcq">MCQ</option>
          <option value="short">Short</option>
          <option value="long">Long</option>
        </TextSelect>
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Class">
          <TextSelect
            value={form.classId}
            onChange={(e) => {
              const classId = e.target.value;
              const nextBook = books.find((b) => b.classId === classId);
              const nextChapter = chapters.find(
                (c) => c.bookId === nextBook?.id,
              );
              setForm((f) => ({
                ...f,
                classId,
                bookId: nextBook?.id || "",
                chapterId: nextChapter?.id || "",
              }));
            }}
            required
          >
            <option value="">Select class</option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </TextSelect>
        </Field>

        <Field label="Book">
          <TextSelect
            value={form.bookId}
            onChange={(e) => {
              const bookId = e.target.value;
              const nextChapter = chapters.find((c) => c.bookId === bookId);
              setForm((f) => ({
                ...f,
                bookId,
                chapterId: nextChapter?.id || "",
              }));
            }}
            required
          >
            <option value="">Select book</option>
            {booksForClass.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </TextSelect>
        </Field>

        <Field label="Chapter">
          <TextSelect
            value={form.chapterId}
            onChange={(e) =>
              setForm((f) => ({ ...f, chapterId: e.target.value }))
            }
            required
          >
            <option value="">Select chapter</option>
            {chaptersForBook.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </TextSelect>
        </Field>
      </div>

      {form.type === "mcq" ? (
        <McqOptionsFields options={form.options} onChange={updateMcqOption} />
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          {editing ? "Save changes" : "Create"}
        </Button>
      </div>
    </form>
  );
}
