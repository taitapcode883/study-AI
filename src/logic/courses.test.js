import { describe, expect, it } from 'vitest';
import { addCourse, createCourse } from './courses.js';

describe('createCourse', () => {
  it('gắn id cho môn học', () => {
    const course = createCourse({ name: 'Toán', credits: 3, grade: 8.5 }, () => 'id-1');
    expect(course).toEqual({ id: 'id-1', name: 'Toán', credits: 3, grade: 8.5 });
  });

  it('tự sinh id khác nhau nếu không truyền hàm tạo id', () => {
    const a = createCourse({ name: 'A', credits: 1, grade: 5 });
    const b = createCourse({ name: 'B', credits: 1, grade: 5 });
    expect(typeof a.id).toBe('string');
    expect(a.id).not.toBe(b.id);
  });
});

describe('addCourse', () => {
  it('thêm vào cuối danh sách và không sửa mảng cũ', () => {
    const first = { id: '1', name: 'A', credits: 2, grade: 7 };
    const second = { id: '2', name: 'B', credits: 3, grade: 9 };
    const original = [first];

    const result = addCourse(original, second);

    expect(result).toEqual([first, second]);
    expect(original).toEqual([first]);
  });
});
