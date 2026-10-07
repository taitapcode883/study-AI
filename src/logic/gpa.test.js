import { describe, expect, it } from 'vitest';
import { classify, roundTo2Decimals, summarize } from './gpa.js';

const course = (credits, grade) => ({ id: `${credits}-${grade}`, name: 'Môn', credits, grade });

describe('roundTo2Decimals', () => {
  it('làm tròn đúng ở các giá trị dễ sai số dấu phẩy động', () => {
    expect(roundTo2Decimals(1.005)).toBe(1.01);
    expect(roundTo2Decimals(3.14159)).toBe(3.14);
    expect(roundTo2Decimals(2.675)).toBe(2.68);
    expect(roundTo2Decimals(3)).toBe(3);
  });
});

describe('classify', () => {
  it.each([
    [4.0, 'Xuất sắc'],
    [3.6, 'Xuất sắc'],
    [3.59, 'Giỏi'],
    [3.2, 'Giỏi'],
    [3.19, 'Khá'],
    [2.5, 'Khá'],
    [2.49, 'Trung bình'],
    [2.0, 'Trung bình'],
    [1.99, 'Yếu'],
    [0, 'Yếu'],
  ])('%d → %s', (gpa4, label) => {
    expect(classify(gpa4)).toBe(label);
  });
});

describe('summarize', () => {
  it('danh sách rỗng: số liệu bằng 0, GPA và xếp loại là null', () => {
    expect(summarize([])).toEqual({
      courseCount: 0,
      totalCredits: 0,
      passedCredits: 0,
      gpa4: null,
      gpa10: null,
      classification: null,
    });
  });

  it('một môn', () => {
    expect(summarize([course(3, 8.5)])).toEqual({
      courseCount: 1,
      totalCredits: 3,
      passedCredits: 3,
      gpa4: 4,
      gpa10: 8.5,
      classification: 'Xuất sắc',
    });
  });

  it('tính GPA có trọng số theo tín chỉ', () => {
    // hệ 4: (4.0*3 + 3.0*2) / 5 = 3.6; hệ 10: (9*3 + 7*2) / 5 = 8.2
    const result = summarize([course(3, 9), course(2, 7)]);
    expect(result.gpa4).toBe(3.6);
    expect(result.gpa10).toBe(8.2);
    expect(result.classification).toBe('Xuất sắc');
  });

  it('làm tròn GPA 2 chữ số', () => {
    // hệ 4: (3.5*1 + 3.0*2) / 3 = 3.1666… → 3.17; hệ 10: (8*1 + 7.5*2) / 3 = 7.666… → 7.67
    const result = summarize([course(1, 8), course(2, 7.5)]);
    expect(result.gpa4).toBe(3.17);
    expect(result.gpa10).toBe(7.67);
    expect(result.classification).toBe('Khá');
  });

  it('xếp loại dựa trên GPA hệ 4 đã làm tròn', () => {
    // hệ 4: (4.0*30 + 1.5*5 + 2.0*1) / 36 = 129.5 / 36 = 3.597… → 3.6 (chưa làm tròn sẽ là Giỏi)
    const result = summarize([
      course(10, 9),
      course(10, 9),
      course(10, 9),
      course(5, 5),
      course(1, 6),
    ]);
    expect(result.gpa4).toBe(3.6);
    expect(result.classification).toBe('Xuất sắc');
  });

  it('tín chỉ đạt chỉ tính môn có điểm ≥ 4.0', () => {
    const result = summarize([course(3, 4.0), course(2, 3.9), course(4, 10)]);
    expect(result.courseCount).toBe(3);
    expect(result.totalCredits).toBe(9);
    expect(result.passedCredits).toBe(7);
  });

  it('môn điểm F vẫn tính vào tổng tín chỉ và GPA', () => {
    // hệ 4: (0*2 + 2.0*2) / 4 = 1.0
    const result = summarize([course(2, 3), course(2, 6)]);
    expect(result.gpa4).toBe(1);
    expect(result.gpa10).toBe(4.5);
    expect(result.classification).toBe('Yếu');
  });
});
