"use client";

import { use } from "react";
import { BooksGrid } from "./features";

export default function ClassBooksPage({ params }) {
  const { classId } = use(params);
  return <BooksGrid classId={classId} />;
}
