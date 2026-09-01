import { Badge } from "@/components/ui";
import { TYPE_LABEL } from "./questionsAdminData";

export function buildQuestionColumns({ classNameById, bookNameById, chapterNameById }) {
  return [
    {
      key: "type",
      label: "Type",
      render: (row) => (
        <Badge variant="outline">{TYPE_LABEL[row.type] ?? row.type}</Badge>
      ),
    },
    {
      key: "statement",
      label: "Statement",
      render: (row) => (
        <span className="line-clamp-2 max-w-sm">{row.statement}</span>
      ),
    },
    {
      key: "classId",
      label: "Class",
      render: (row) =>
        classNameById[row.classId] || row.className || "—",
    },
    {
      key: "bookId",
      label: "Book",
      render: (row) => bookNameById[row.bookId] || row.bookName || "—",
    },
    {
      key: "chapterId",
      label: "Chapter",
      render: (row) =>
        chapterNameById[row.chapterId] || row.chapterName || "—",
    },
  ];
}
