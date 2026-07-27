const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || "http://localhost:5000";

export const API_ENDPOINTS = {
  // ---------------Classes-----------------
  addSchoolClass: `${BASE_URL}/api/admin/createClass`,
  getClasses: `${BASE_URL}/api/schoolclasses`,
  getAdminDashboardStats: `${BASE_URL}/api/admin/dashboard/stats`,
  // updateClass: (id) => `${BASE_URL}/api/admin/classes/${id}`,
  // deleteClass: (id) => `${BASE_URL}/api/admin/classes/${id}`,
  // getClasses: `${BASE_URL}/api/admin/classes`,



//   ------------Books-----------------
  addBook: `${BASE_URL}/api/admin/createBook`,
  getBooks: `${BASE_URL}/api/admin/books`,
  updateBook: (id) => `${BASE_URL}/api/admin/books/${id}`,
  deleteBook: (id) => `${BASE_URL}/api/admin/books/${id}`,
};