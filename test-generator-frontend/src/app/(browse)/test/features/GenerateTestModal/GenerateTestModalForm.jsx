import { Button } from "@/components/ui";
import { cn } from "@/utils";

const fieldClass =
  "mt-1.5 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-3 py-2 text-small text-neutral-900 outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-500/30";

export function GenerateTestModalForm({
  instituteName,
  setInstituteName,
  institutes,
  timeAllowed,
  setTimeAllowed,
  copiesPerPage,
  setCopiesPerPage,
  headingFontSize,
  setHeadingFontSize,
  subtextFontSize,
  setSubtextFontSize,
  mcqMarks,
  setMcqMarks,
  shortMarks,
  setShortMarks,
  longMarks,
  setLongMarks,
  counts,
  totalMarks,
  errors = { institute: "", time: "" },
  onClose,
  onSubmit,
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="block">
        <span className="text-caption font-medium text-neutral-600">
          Institute name
        </span>
        <input
          list="institute-history"
          value={instituteName}
          onChange={(e) => setInstituteName(e.target.value)}
          placeholder="e.g. Crescent Public School"
          className={fieldClass}
          aria-invalid={Boolean(errors.institute) || undefined}
        />
        {errors.institute ? (
          <p className="mt-1.5 text-caption text-error-600" role="alert">
            {errors.institute}
          </p>
        ) : null}
        <datalist id="institute-history">
          {institutes.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        {institutes.length > 0 ? (
          <select
            className={cn(fieldClass, "mt-2")}
            value={institutes.includes(instituteName) ? instituteName : ""}
            onChange={(e) => {
              if (e.target.value) setInstituteName(e.target.value);
            }}
            aria-label="Select saved institute"
          >
            <option value="">Select saved institute…</option>
            {institutes.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        ) : null}
      </label>

      <label className="block">
        <span className="text-caption font-medium text-neutral-600">
          Total time
        </span>
        <input
          type="text"
          value={timeAllowed}
          onChange={(e) => setTimeAllowed(e.target.value)}
          placeholder="e.g. 2 hours"
          className={fieldClass}
          aria-invalid={Boolean(errors.time) || undefined}
        />
        {errors.time ? (
          <p className="mt-1.5 text-caption text-error-600" role="alert">
            {errors.time}
          </p>
        ) : null}
      </label>

      <label className="block">
        <span className="text-caption font-medium text-neutral-600">
          Tests per page
        </span>
        <select
          value={copiesPerPage}
          onChange={(e) => setCopiesPerPage(Number(e.target.value))}
          className={fieldClass}
        >
          <option value={1}>1 — full page</option>
          <option value={2}>2 — upper &amp; lower halves</option>
          <option value={4}>4 — 2×2 grid (left/right, upper/lower)</option>
        </select>
        <span className="mt-1 block text-caption text-neutral-500">
          {copiesPerPage === 1 && "One complete test printed on the page."}
          {copiesPerPage === 2 &&
            "Page split into top and bottom — same test in each half."}
          {copiesPerPage === 4 &&
            "Page split into four quadrants — same test in each section."}
        </span>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-caption font-medium text-neutral-600">
            Heading text size (px)
          </span>
          <input
            type="number"
            min="8"
            max="48"
            step="1"
            value={headingFontSize}
            onChange={(e) => setHeadingFontSize(e.target.value)}
            className={fieldClass}
            required
          />
          <span className="mt-1 block text-caption text-neutral-500">
            Institute title — default 18px
          </span>
        </label>
        <label className="block">
          <span className="text-caption font-medium text-neutral-600">
            Subtext size (px)
          </span>
          <input
            type="number"
            min="8"
            max="48"
            step="1"
            value={subtextFontSize}
            onChange={(e) => setSubtextFontSize(e.target.value)}
            className={fieldClass}
            required
          />
          <span className="mt-1 block text-caption text-neutral-500">
            Questions &amp; details — default 12px
          </span>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="text-caption font-medium text-neutral-600">
            Marks / MCQ
          </span>
          <input
            type="number"
            min="1"
            value={mcqMarks}
            onChange={(e) => setMcqMarks(e.target.value)}
            className={fieldClass}
            required
          />
          <span className="mt-1 block text-caption text-neutral-500">
            {counts.mcq} selected
          </span>
        </label>
        <label className="block">
          <span className="text-caption font-medium text-neutral-600">
            Marks / Short
          </span>
          <input
            type="number"
            min="1"
            value={shortMarks}
            onChange={(e) => setShortMarks(e.target.value)}
            className={fieldClass}
            required
          />
          <span className="mt-1 block text-caption text-neutral-500">
            {counts.short} selected
          </span>
        </label>
        <label className="block">
          <span className="text-caption font-medium text-neutral-600">
            Marks / Long
          </span>
          <input
            type="number"
            min="1"
            value={longMarks}
            onChange={(e) => setLongMarks(e.target.value)}
            className={fieldClass}
            required
          />
          <span className="mt-1 block text-caption text-neutral-500">
            {counts.long} selected
          </span>
        </label>
      </div>

      <div className="rounded-[var(--radius-md)] border border-neutral-200 bg-neutral-50 px-4 py-3">
        <p className="text-small text-neutral-600">Calculated total marks</p>
        <p className="mt-1 text-h4 font-semibold text-primary-700">
          {totalMarks}
        </p>
        <p className="mt-1 text-caption text-neutral-500">
          ({counts.mcq} × {Number(mcqMarks) || 0}) + ({counts.short} ×{" "}
          {Number(shortMarks) || 0}) + ({counts.long} × {Number(longMarks) || 0})
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Preview paper</Button>
      </div>
    </form>
  );
}
