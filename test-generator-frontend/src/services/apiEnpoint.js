const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || "http://localhost:5000";

export const API_ENDPOINTS = {
  // ---------------Auth-----------------
  login: `${BASE_URL}/api/auth/login`,
  logout: `${BASE_URL}/api/auth/logout`,
  getMe: `${BASE_URL}/api/auth/me`,
  getAdmins: `${BASE_URL}/api/auth/admins`,
  createAdmin: `${BASE_URL}/api/auth/admins`,
  suspendAdmin: (id) => `${BASE_URL}/api/auth/admins/${id}/suspend`,
  deleteAdmin: (id) => `${BASE_URL}/api/auth/admins/${id}`,

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
  updateBook: (id) => `${BASE_URL}/api/admin/updateBook/${id}`,
  deleteBook: (id) => `${BASE_URL}/api/admin/deleteBook/${id}`,


// ------------Chapters-----------------
  addChapter: `${BASE_URL}/api/admin/createChapter`,
  getChapters: `${BASE_URL}/api/chapter`,
  updateChapter: (id) => `${BASE_URL}/api/admin/updateChapter/${id}`,
  deleteChapter: (id) => `${BASE_URL}/api/admin/deleteChapter/${id}`,

  // ------------Questions-----------------
  getLongQuestions: `${BASE_URL}/api/questions`,
  getShortQuestions: `${BASE_URL}/api/questions/getshort`,
  getMcqQuestions: `${BASE_URL}/api/questions/getmcq`,
  createLongQuestion: `${BASE_URL}/api/admin/createLongQuestion`,
  createShortQuestion: `${BASE_URL}/api/admin/createShortQuestion`,
  createMcqQuestion: `${BASE_URL}/api/admin/createMcqQuestion`,
  updateLongQuestion: (id) => `${BASE_URL}/api/admin/updateLongQuestion/${id}`,
  updateShortQuestion: (id) => `${BASE_URL}/api/admin/updateShortQuestion/${id}`,
  updateMcqQuestion: (id) => `${BASE_URL}/api/admin/updateMcqQuestion/${id}`,
  deleteLongQuestion: (id) => `${BASE_URL}/api/admin/deleteLongQuestion/${id}`,
  deleteShortQuestion: (id) => `${BASE_URL}/api/admin/deleteShortQuestion/${id}`,
  deleteMcqQuestion: (id) => `${BASE_URL}/api/admin/deleteMcqQuestion/${id}`,

};