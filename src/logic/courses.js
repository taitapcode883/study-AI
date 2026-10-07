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
