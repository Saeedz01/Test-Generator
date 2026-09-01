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
  getBooks: `${BASE_URL}/api/book`,
  updateBook: (id) => `${BASE_URL}/api/admin/books/${id}`,
  deleteBook: (id) => `${BASE_URL}/api/admin/books/${id}`,



// ------------Chapters-----------------
  addChapter: `${BASE_URL}/api/admin/createChapter`,
  getChapters: `${BASE_URL}/api/chapter`,

  // ------------Questions-----------------
  getLongQuestions: `${BASE_URL}/api/questions`,
  getShortQuestions: `${BASE_URL}/api/questions/getshort`,
  getMcqQuestions: `${BASE_URL}/api/questions/getmcq`,
  createLongQuestion: `${BASE_URL}/api/admin/createLongQuestion`,
  createShortQuestion: `${BASE_URL}/api/admin/createShortQuestion`,
  createMcqQuestion: `${BASE_URL}/api/admin/createMcqQuestion`,
  deleteLongQuestion: (id) => `${BASE_URL}/api/questions/delLng/${id}`,
  deleteShortQuestion: (id) => `${BASE_URL}/api/questions/delShort/${id}`,
  deleteMcqQuestion: (id) => `${BASE_URL}/api/questions/delMcq/${id}`,

};