"use client";

import { use } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BooksGrid } from "@/features/books";
import { getClassById } from "@/data/curriculum";
import { selectClass } from "@/store/selectionSlice";

export default function ClassBooksPage({ params }) {
  const { classId } = use(params);
  const dispatch = useDispatch();

  useEffect(() => {
    const schoolClass = getClassById(classId);
    if (schoolClass) dispatch(selectClass(schoolClass));
  }, [classId, dispatch]);

  return <BooksGrid classId={classId} />;
}
