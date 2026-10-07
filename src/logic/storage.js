// Lưu/tải danh sách môn học trong localStorage (F5).
// Mọi lỗi (bị chặn, đầy bộ nhớ, dữ liệu hỏng) đều được nuốt để trang không bị trắng.
import { validateCredits, validateGrade, validateName } from './validation.js';

export const STORAGE_KEY = 'gpa-tracker:v1';

/** Lấy localStorage của trình duyệt; trả về null nếu không truy cập được. */
function defaultStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/** Môn học đọc từ bộ nhớ có đúng quy tắc F1 không? Trả về môn đã chuẩn hoá hoặc null. */
function sanitizeCourse(item) {
  if (item === null || typeof item !== 'object') return null;
  const { id, name, credits, grade } = item;
  if (typeof id !== 'string' || id === '') return null;
  if (typeof name !== 'string' || typeof credits !== 'number' || typeof grade !== 'number') {
    return null;
  }

  const nameResult = validateName(name);
  const creditsResult = validateCredits(credits);
  const gradeResult = validateGrade(grade);
  if (nameResult.error || creditsResult.error || gradeResult.error) return null;

  return { id, name: nameResult.value, credits: creditsResult.value, grade: gradeResult.value };
}

/**
 * Đọc chuỗi JSON đã lưu thành danh sách môn.
 * Dữ liệu hỏng hoàn toàn → []. Hỏng một phần → giữ các môn hợp lệ, bỏ phần tử hỏng
 * (kể cả phần tử trùng id).
 */
export function parseCourses(raw) {
  if (typeof raw !== 'string' || raw === '') return [];

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];

  const seenIds = new Set();
  const courses = [];
  for (const item of data) {
    const course = sanitizeCourse(item);
    if (!course || seenIds.has(course.id)) continue;
    seenIds.add(course.id);
    courses.push(course);
  }
  return courses;
}

/** Tải danh sách môn từ bộ nhớ. Không bao giờ ném lỗi. */
export function loadCourses(storage = defaultStorage()) {
  try {
    return parseCourses(storage?.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

/** Lưu danh sách môn. Trả về true nếu ghi thành công; lỗi ghi được bỏ qua. */
export function saveCourses(courses, storage = defaultStorage()) {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(courses));
    return true;
  } catch {
    return false;
  }
}
