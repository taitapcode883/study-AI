// Thao tác trên danh sách môn học. Hàm thuần: luôn trả về mảng mới, không sửa mảng cũ.

function generateId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Tạo môn học từ dữ liệu đã qua validateCourseInput.
 * @param {{ name: string, credits: number, grade: number }} value
 */
export function createCourse({ name, credits, grade }, makeId = generateId) {
  return { id: makeId(), name, credits, grade };
}

/** Thêm môn vào cuối danh sách. */
export function addCourse(courses, course) {
  return [...courses, course];
}

/** Thay môn có id tương ứng bằng dữ liệu mới, giữ nguyên id và vị trí. */
export function updateCourse(courses, id, { name, credits, grade }) {
  return courses.map((course) => (course.id === id ? { id, name, credits, grade } : course));
}

/** Xoá môn có id tương ứng khỏi danh sách. */
export function removeCourse(courses, id) {
  return courses.filter((course) => course.id !== id);
}
