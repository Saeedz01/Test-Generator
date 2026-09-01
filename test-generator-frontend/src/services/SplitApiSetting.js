import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';

export const SplitApiSettings = createApi({
  reducerPath: 'splitApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${BACKEND_URL}/api` }),
  tagTypes: ['SchoolClass', 'Book', 'Chapter', 'Question', 'DashboardStats'],
  endpoints: () => ({}),
});
