import { describe, expect, it } from 'vitest';
import { addCourse, createCourse, removeCourse, updateCourse } from './courses.js';

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

describe('updateCourse', () => {
  const list = [
    { id: '1', name: 'A', credits: 2, grade: 7 },
    { id: '2', name: 'B', credits: 3, grade: 9 },
    { id: '3', name: 'C', credits: 4, grade: 5 },
  ];

  it('thay dữ liệu môn theo id, giữ nguyên id và vị trí', () => {
    const result = updateCourse(list, '2', { name: 'B mới', credits: 1, grade: 6.5 });
    expect(result).toEqual([
      list[0],
      { id: '2', name: 'B mới', credits: 1, grade: 6.5 },
      list[2],
    ]);
  });

  it('không sửa mảng cũ', () => {
    const snapshot = structuredClone(list);
    updateCourse(list, '1', { name: 'X', credits: 1, grade: 1 });
    expect(list).toEqual(snapshot);
  });

  it('id không tồn tại thì danh sách giữ nguyên', () => {
    expect(updateCourse(list, 'khong-co', { name: 'X', credits: 1, grade: 1 })).toEqual(list);
  });
});

describe('removeCourse', () => {
  const list = [
    { id: '1', name: 'A', credits: 2, grade: 7 },
    { id: '2', name: 'B', credits: 3, grade: 9 },
  ];

  it('xoá đúng môn theo id và không sửa mảng cũ', () => {
    expect(removeCourse(list, '1')).toEqual([list[1]]);
    expect(list).toHaveLength(2);
  });

  it('id không tồn tại thì danh sách giữ nguyên', () => {
    expect(removeCourse(list, 'khong-co')).toEqual(list);
  });

  it('xoá môn cuối cùng cho ra danh sách rỗng', () => {
    expect(removeCourse([list[0]], '1')).toEqual([]);
  });
});
