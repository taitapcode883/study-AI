// Kiểm tra dữ liệu môn học (F1, dùng lại cho F4 và F5).
// Hàm thuần, không đụng tới DOM để Vitest test trực tiếp.

export const NAME_MAX_LENGTH = 100;
export const CREDITS_MIN = 1;
export const CREDITS_MAX = 10;
export const GRADE_MIN = 0;
export const GRADE_MAX = 10;

export const MESSAGES = {
  nameRequired: 'Vui lòng nhập tên môn',
  nameTooLong: `Tên môn tối đa ${NAME_MAX_LENGTH} ký tự`,
  creditsInvalid: `Số tín chỉ phải là số nguyên từ ${CREDITS_MIN} đến ${CREDITS_MAX}`,
  gradeInvalid: `Điểm phải là số từ ${GRADE_MIN} đến ${GRADE_MAX}`,
};

/**
 * Làm tròn 1 chữ số thập phân, tránh sai số dấu phẩy động
 * (Math.round(8.45 * 10) cho 84 vì 8.45 * 10 = 84.49999...).
 */
export function roundTo1Decimal(value) {
  return Number(`${Math.round(Number(`${value}e1`))}e-1`);
}

/** Kiểm tra Tên môn. Trả về { value } hoặc { error }. */
export function validateName(raw) {
  const name = String(raw ?? '').trim();
  if (name === '') return { error: MESSAGES.nameRequired };
  if (name.length > NAME_MAX_LENGTH) return { error: MESSAGES.nameTooLong };
  return { value: name };
}

/** Kiểm tra Số tín chỉ: số nguyên 1–10. Trả về { value } hoặc { error }. */
export function validateCredits(raw) {
  const text = String(raw ?? '').trim();
  if (!/^\d+$/.test(text)) return { error: MESSAGES.creditsInvalid };
  const credits = Number(text);
  if (credits < CREDITS_MIN || credits > CREDITS_MAX) {
    return { error: MESSAGES.creditsInvalid };
  }
  return { value: credits };
}

/**
 * Kiểm tra Điểm hệ 10: số 0–10, chấp nhận "8,5" và "8.5".
 * Điểm hợp lệ được làm tròn 1 chữ số thập phân. Trả về { value } hoặc { error }.
 */
export function validateGrade(raw) {
  const text = String(raw ?? '').trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(text)) return { error: MESSAGES.gradeInvalid };
  const grade = Number(text);
  if (grade < GRADE_MIN || grade > GRADE_MAX) return { error: MESSAGES.gradeInvalid };
  return { value: roundTo1Decimal(grade) };
}

/**
 * Kiểm tra cả 3 ô cùng lúc để hiện mọi lỗi một lượt.
 * @returns {{ valid: boolean, errors: { name?: string, credits?: string, grade?: string },
 *            value: { name: string, credits: number, grade: number } | null }}
 */
export function validateCourseInput({ name, credits, grade }) {
  const results = {
    name: validateName(name),
    credits: validateCredits(credits),
    grade: validateGrade(grade),
  };

  const errors = {};
  for (const [field, result] of Object.entries(results)) {
    if (result.error) errors[field] = result.error;
  }

  const valid = Object.keys(errors).length === 0;
  return {
    valid,
    errors,
    value: valid
      ? { name: results.name.value, credits: results.credits.value, grade: results.grade.value }
      : null,
  };
}
