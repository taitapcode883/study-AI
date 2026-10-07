import { describe, expect, it } from 'vitest';
import {
  MESSAGES,
  roundTo1Decimal,
  validateCourseInput,
  validateCredits,
  validateGrade,
  validateName,
} from './validation.js';

describe('validateName', () => {
  it('bỏ khoảng trắng 2 đầu', () => {
    expect(validateName('  Toán cao cấp  ')).toEqual({ value: 'Toán cao cấp' });
  });

  it.each(['', '   ', undefined, null])('báo lỗi khi rỗng: %j', (raw) => {
    expect(validateName(raw)).toEqual({ error: MESSAGES.nameRequired });
  });

  it('chấp nhận đúng 100 ký tự', () => {
    expect(validateName('a'.repeat(100))).toEqual({ value: 'a'.repeat(100) });
  });

  it('báo lỗi khi dài hơn 100 ký tự', () => {
    expect(validateName('a'.repeat(101))).toEqual({ error: MESSAGES.nameTooLong });
  });

  it('đếm độ dài sau khi bỏ khoảng trắng 2 đầu', () => {
    expect(validateName(`  ${'a'.repeat(100)}  `)).toEqual({ value: 'a'.repeat(100) });
  });
});

describe('validateCredits', () => {
  it.each([
    ['1', 1],
    ['3', 3],
    ['10', 10],
    [' 4 ', 4],
    [5, 5],
  ])('chấp nhận %j', (raw, expected) => {
    expect(validateCredits(raw)).toEqual({ value: expected });
  });

  it.each(['', '0', '11', '-1', '2.5', '3,0', 'abc', '1e1', ' ', undefined])(
    'báo lỗi với %j',
    (raw) => {
      expect(validateCredits(raw)).toEqual({ error: MESSAGES.creditsInvalid });
    },
  );
});

describe('validateGrade', () => {
  it.each([
    ['8.5', 8.5],
    ['8,5', 8.5],
    ['0', 0],
    ['10', 10],
    ['10.0', 10],
    [' 7 ', 7],
    ['8.45', 8.5],
    ['8,44', 8.4],
    ['9.96', 10],
    ['4.05', 4.1],
    [6.5, 6.5],
  ])('chấp nhận %j → %d', (raw, expected) => {
    expect(validateGrade(raw)).toEqual({ value: expected });
  });

  it.each(['', '-1', '10.1', '11', 'abc', '8,5,1', '8.', '.5', '1e1', '8 5', undefined])(
    'báo lỗi với %j',
    (raw) => {
      expect(validateGrade(raw)).toEqual({ error: MESSAGES.gradeInvalid });
    },
  );
});

describe('roundTo1Decimal', () => {
  it('làm tròn đúng ở các giá trị dễ sai số dấu phẩy động', () => {
    expect(roundTo1Decimal(8.45)).toBe(8.5);
    expect(roundTo1Decimal(1.05)).toBe(1.1);
    expect(roundTo1Decimal(8.44)).toBe(8.4);
  });
});

describe('validateCourseInput', () => {
  it('trả về dữ liệu đã chuẩn hoá khi hợp lệ', () => {
    expect(validateCourseInput({ name: ' Lập trình ', credits: '3', grade: '8,45' })).toEqual({
      valid: true,
      errors: {},
      value: { name: 'Lập trình', credits: 3, grade: 8.5 },
    });
  });

  it('báo đủ cả 3 lỗi cùng lúc', () => {
    expect(validateCourseInput({ name: '', credits: '0', grade: '11' })).toEqual({
      valid: false,
      errors: {
        name: MESSAGES.nameRequired,
        credits: MESSAGES.creditsInvalid,
        grade: MESSAGES.gradeInvalid,
      },
      value: null,
    });
  });

  it('chỉ báo lỗi ở ô sai', () => {
    const result = validateCourseInput({ name: 'Vật lý', credits: '2', grade: 'x' });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({ grade: MESSAGES.gradeInvalid });
  });
});
