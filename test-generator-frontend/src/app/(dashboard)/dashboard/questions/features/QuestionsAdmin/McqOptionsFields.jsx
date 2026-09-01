import { Field, TextInput } from "../../../features/AdminFormFields";
import { Typography } from "@/components/ui";
import { MCQ_OPTION_LABELS } from "./questionsAdminData";

export function McqOptionsFields({ options, onChange }) {
  return (
    <fieldset className="space-y-3 rounded-[var(--radius-md)] border border-neutral-200 bg-neutral-50/80 p-4">
      <legend className="px-1">
        <Typography variant="label" className="text-neutral-700">
          Answer options
        </Typography>
      </legend>
      <Typography variant="bodySmall" className="text-neutral-500">
        Enter all four choices. They will be saved as a single options array.
      </Typography>

      <div className="grid gap-3 sm:grid-cols-2">
        {MCQ_OPTION_LABELS.map((label, index) => (
          <Field key={label} label={`Option ${label}`}>
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-primary-200 bg-primary-50 text-caption font-semibold text-primary-700"
              >
                {label}
              </span>
              <TextInput
                value={options[index] ?? ""}
                onChange={(e) => onChange(index, e.target.value)}
                placeholder={`Enter option ${label}`}
                required
              />
            </div>
          </Field>
        ))}
      </div>
    </fieldset>
  );
}
