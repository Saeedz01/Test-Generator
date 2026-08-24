"use client";

import { use } from "react";
import { QuestionsBoard } from "./features";

export default function ChapterQuestionsPage({ params }) {
  const { classId, bookId, chapterId } = use(params);
  return (
    <QuestionsBoard classId={classId} bookId={bookId} chapterId={chapterId} />
  );
}
