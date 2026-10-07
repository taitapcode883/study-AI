// Tính GPA và xếp loại (F3). Hàm thuần, không đụng tới DOM.
import { convertGrade } from './grading.js';

export const PASS_GRADE = 4.0;

/** Ngưỡng xếp loại theo GPA hệ 4 (đã làm tròn), xếp từ cao xuống thấp. */
export const CLASSIFICATIONS = [
  { min: 3.6, label: 'Xuất sắc' },
  { min: 3.2, label: 'Giỏi' },
  { min: 2.5, label: 'Khá' },
  { min: 2.0, label: 'Trung bình' },
  { min: 0, label: 'Yếu' },
];

/** Làm tròn 2 chữ số thập phân, dùng ký pháp mũ để tránh sai số dấu phẩy động. */
export function roundTo2Decimals(value) {
  return Number(`${Math.round(Number(`${value}e2`))}e-2`);
}

/** Xếp loại học lực theo GPA hệ 4. */
export function classify(gpa4) {
  const entry = CLASSIFICATIONS.find((item) => gpa4 >= item.min) ?? CLASSIFICATIONS.at(-1);
  return entry.label;
}

/**
 * Tổng kết danh sách môn học.
 * Danh sách rỗng: GPA và xếp loại là null (giao diện hiển thị "—").
 * @param {{ credits: number, grade: number }[]} courses
 * @returns {{ courseCount: number, totalCredits: number, passedCredits: number,
 *            gpa4: number | null, gpa10: number | null, classification: string | null }}
 */
export function summarize(courses) {
  let totalCredits = 0;
  let passedCredits = 0;
  let weighted4 = 0;
  let weighted10 = 0;

  for (const course of courses) {
    totalCredits += course.credits;
    if (course.grade >= PASS_GRADE) passedCredits += course.credits;
    weighted4 += convertGrade(course.grade).point4 * course.credits;
    weighted10 += course.grade * course.credits;
  }

  if (totalCredits === 0) {
    return {
      courseCount: courses.length,
      totalCredits: 0,
      passedCredits: 0,
      gpa4: null,
      gpa10: null,
      classification: null,
    };
  }

  const gpa4 = roundTo2Decimals(weighted4 / totalCredits);
  return {
    courseCount: courses.length,
    totalCredits,
    passedCredits,
    gpa4,
    gpa10: roundTo2Decimals(weighted10 / totalCredits),
    classification: classify(gpa4),
  };
}
