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
        Enter English and Urdu for each choice. Option order stays linked across
        languages.
      </Typography>

      <div className="space-y-4">
        {MCQ_OPTION_LABELS.map((label, index) => (
          <div
            key={label}
            className="rounded-[var(--radius-sm)] border border-neutral-200 bg-neutral-0 p-3"
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-primary-200 bg-primary-50 text-caption font-semibold text-primary-700"
              >
                {label}
              </span>
              <Typography variant="label" className="text-neutral-700">
                Option {label}
              </Typography>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="English">
                <TextInput
                  value={options[index]?.en ?? ""}
                  onChange={(e) => onChange(index, "en", e.target.value)}
                  placeholder={`Option ${label} (English)`}
                  required
                />
              </Field>
              <Field label="Urdu">
                <TextInput
                  value={options[index]?.ur ?? ""}
                  onChange={(e) => onChange(index, "ur", e.target.value)}
                  placeholder={`آپشن ${label}`}
                  dir="rtl"
                  required
                />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
