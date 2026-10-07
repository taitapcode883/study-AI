// Quy đổi điểm hệ 10 → điểm chữ → hệ 4 (F2). Hàm thuần, dùng lại cho F3.
import { roundTo1Decimal } from './validation.js';

/** Bảng quy đổi theo PRD, xếp từ mốc cao xuống thấp. */
export const GRADE_SCALE = [
  { min: 8.5, letter: 'A', point4: 4.0 },
  { min: 8.0, letter: 'B+', point4: 3.5 },
  { min: 7.0, letter: 'B', point4: 3.0 },
  { min: 6.5, letter: 'C+', point4: 2.5 },
  { min: 5.5, letter: 'C', point4: 2.0 },
  { min: 5.0, letter: 'D+', point4: 1.5 },
  { min: 4.0, letter: 'D', point4: 1.0 },
  { min: 0, letter: 'F', point4: 0.0 },
];

/**
 * Quy đổi điểm hệ 10 sang điểm chữ và hệ 4.
 * Điểm được làm tròn 1 chữ số trước khi so mốc vì bảng có khe (8.4 → B+, 8.5 → A).
 * @param {number} grade10 điểm hệ 10 (0–10)
 * @returns {{ letter: string, point4: number }}
 */
export function convertGrade(grade10) {
  const grade = roundTo1Decimal(grade10);
  const band = GRADE_SCALE.find((entry) => grade >= entry.min) ?? GRADE_SCALE.at(-1);
  return { letter: band.letter, point4: band.point4 };
}
