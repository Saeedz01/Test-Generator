import toast from "react-hot-toast";
import {
  useCreateLongQuestionMutation,
  useCreateMcqQuestionMutation,
  useCreateShortQuestionMutation,
  useUpdateLongQuestionMutation,
  useUpdateMcqQuestionMutation,
  useUpdateShortQuestionMutation,
} from "@/services/api/questions.api";
import { buildCreatePayload, buildMcqOptions } from "./questionsAdminHelpers";

/**
 * Create / update submit handler for the question form modal.
 * @param {{ form: object, editing: object | null, onSaved: () => void }} params
 */
export function useSaveQuestion({ form, editing, onSaved }) {
  const [createLongQuestion, { isLoading: creatingLong }] =
    useCreateLongQuestionMutation();
  const [createShortQuestion, { isLoading: creatingShort }] =
    useCreateShortQuestionMutation();
  const [createMcqQuestion, { isLoading: creatingMcq }] =
    useCreateMcqQuestionMutation();
  const [updateLongQuestion, { isLoading: updatingLong }] =
    useUpdateLongQuestionMutation();
  const [updateShortQuestion, { isLoading: updatingShort }] =
    useUpdateShortQuestionMutation();
  const [updateMcqQuestion, { isLoading: updatingMcq }] =
    useUpdateMcqQuestionMutation();

  const isSaving =
    creatingLong ||
    creatingShort ||
    creatingMcq ||
    updatingLong ||
    updatingShort ||
    updatingMcq;

  const submit = async (event) => {
    event.preventDefault();

    if (
      !form.statement.trim() ||
      !form.statementUr?.trim() ||
      !form.classId ||
      !form.bookId ||
      !form.chapterId
    ) {
      toast.error("English and Urdu statements, class, book, and chapter are required");
      return;
    }

    if (editing) {
      const payload = buildCreatePayload(form);

      try {
        if (editing.type === "mcq") {
          const options = buildMcqOptions(form.options);
          if (
            options.length !== 4 ||
            options.some((option) => !option.en || !option.ur)
          ) {
            toast.error("All four MCQ options require English and Urdu text");
            return;
          }

          await updateMcqQuestion({
            id: editing.id,
            ...payload,
            options,
          }).unwrap();
        } else if (editing.type === "short") {
          await updateShortQuestion({
            id: editing.id,
            ...payload,
          }).unwrap();
        } else {
          await updateLongQuestion({
            id: editing.id,
            ...payload,
          }).unwrap();
        }

        toast.success("Question updated");
        onSaved();
      } catch (err) {
        toast.error(err?.data?.message || err?.error || "Failed to update question");
      }
      return;
    }

    const payload = buildCreatePayload(form);

    try {
      if (form.type === "mcq") {
        const options = buildMcqOptions(form.options);
        if (
          options.length !== 4 ||
          options.some((option) => !option.en || !option.ur)
        ) {
          toast.error("All four MCQ options require English and Urdu text");
          return;
        }

        await createMcqQuestion({
          ...payload,
          options,
        }).unwrap();
      } else if (form.type === "short") {
        await createShortQuestion(payload).unwrap();
      } else {
        await createLongQuestion(payload).unwrap();
      }

      toast.success("Question added");
      onSaved();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to add question");
    }
  };

  return { submit, isSaving };
}
