import { Button } from "@/components/ui";
import { Field, TextInput, TextSelect, TextTextarea } from "../../../features/AdminFormFields";

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
}) {
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
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Type">
          <TextSelect
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          >
            <option value="mcq">MCQ</option>
            <option value="short">Short</option>
            <option value="long">Long</option>
          </TextSelect>
        </Field>
        <Field label="Difficulty">
          <TextSelect
            value={form.difficulty}
            onChange={(e) =>
              setForm((f) => ({ ...f, difficulty: e.target.value }))
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </TextSelect>
        </Field>
        <Field label="Marks">
          <TextInput
            type="number"
            min="1"
            value={form.marks}
            onChange={(e) => setForm((f) => ({ ...f, marks: e.target.value }))}
          />
        </Field>
      </div>
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
        <>
          <Field label="Options (one per line, 4 options)">
            <TextTextarea
              value={form.optionsText}
              onChange={(e) =>
                setForm((f) => ({ ...f, optionsText: e.target.value }))
              }
            />
          </Field>
          <Field label="Correct option index (0–3)">
            <TextInput
              type="number"
              min="0"
              max="3"
              value={form.correctOptionIndex}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  correctOptionIndex: e.target.value,
                }))
              }
            />
          </Field>
        </>
      ) : (
        <Field label="Sample answer">
          <TextTextarea
            value={form.sampleAnswer}
            onChange={(e) =>
              setForm((f) => ({ ...f, sampleAnswer: e.target.value }))
            }
          />
        </Field>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{editing ? "Save changes" : "Create"}</Button>
      </div>
    </form>
  );
}
