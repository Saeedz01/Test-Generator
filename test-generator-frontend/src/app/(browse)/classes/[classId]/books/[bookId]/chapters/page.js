"use client";

import { use } from "react";
import { ChaptersLayout } from "./features";

export default function BookChaptersPage({ params }) {
  const { classId, bookId } = use(params);
  return <ChaptersLayout classId={classId} bookId={bookId} />;
}
