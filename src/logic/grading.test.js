import { describe, expect, it } from 'vitest';
import { convertGrade } from './grading.js';

describe('convertGrade', () => {
  it.each([
    [10, 'A', 4.0],
    [8.5, 'A', 4.0],
    [8.4, 'B+', 3.5],
    [8.0, 'B+', 3.5],
    [7.9, 'B', 3.0],
    [7.0, 'B', 3.0],
    [6.9, 'C+', 2.5],
    [6.5, 'C+', 2.5],
    [6.4, 'C', 2.0],
    [5.5, 'C', 2.0],
    [5.4, 'D+', 1.5],
    [5.0, 'D+', 1.5],
    [4.9, 'D', 1.0],
    [4.0, 'D', 1.0],
    [3.9, 'F', 0.0],
    [0, 'F', 0.0],
  ])('%d → %s (%d)', (grade10, letter, point4) => {
    expect(convertGrade(grade10)).toEqual({ letter, point4 });
  });

  it('làm tròn 1 chữ số trước khi so mốc (không rơi vào khe giữa các mốc)', () => {
    expect(convertGrade(8.45)).toEqual({ letter: 'A', point4: 4.0 });
    expect(convertGrade(8.44)).toEqual({ letter: 'B+', point4: 3.5 });
    expect(convertGrade(3.95)).toEqual({ letter: 'D', point4: 1.0 });
    expect(convertGrade(6.49)).toEqual({ letter: 'C+', point4: 2.5 });
    expect(convertGrade(6.44)).toEqual({ letter: 'C', point4: 2.0 });
  });
});
