import { describe, expect, it } from 'vitest';
import { STORAGE_KEY, loadCourses, parseCourses, saveCourses } from './storage.js';

/** Bộ nhớ giả lập localStorage. */
function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
  };
}

const throwingStorage = {
  getItem() {
    throw new Error('SecurityError');
  },
  setItem() {
    throw new Error('QuotaExceededError');
  },
};

const math = { id: 'a', name: 'Toán', credits: 3, grade: 8.5 };
const physics = { id: 'b', name: 'Vật lý', credits: 2, grade: 6 };

describe('STORAGE_KEY', () => {
  it('đúng key theo PRD', () => {
    expect(STORAGE_KEY).toBe('gpa-tracker:v1');
  });
});

describe('parseCourses', () => {
  it('đọc danh sách hợp lệ', () => {
    expect(parseCourses(JSON.stringify([math, physics]))).toEqual([math, physics]);
  });

  it.each([null, undefined, '', '{không phải json', 'null', '42', '"chuỗi"', '{"a":1}'])(
    'dữ liệu hỏng hoặc không phải mảng → danh sách rỗng: %j',
    (raw) => {
      expect(parseCourses(raw)).toEqual([]);
    },
  );

  it('hỏng một phần: giữ môn hợp lệ, bỏ phần tử hỏng', () => {
    const raw = JSON.stringify([
      math,
      null,
      'chuỗi',
      { id: 'c', name: '', credits: 3, grade: 7 },
      { id: 'd', name: 'X', credits: 0, grade: 7 },
      { id: 'e', name: 'X', credits: 2.5, grade: 7 },
      { id: 'f', name: 'X', credits: '3', grade: 7 },
      { id: 'g', name: 'X', credits: 3, grade: 11 },
      { id: 'h', name: 'X', credits: 3, grade: '7' },
      { name: 'Không có id', credits: 3, grade: 7 },
      { id: 'i', name: 'a'.repeat(101), credits: 3, grade: 7 },
      physics,
    ]);
    expect(parseCourses(raw)).toEqual([math, physics]);
  });

  it('bỏ phần tử trùng id (giữ phần tử đầu tiên)', () => {
    const raw = JSON.stringify([math, { ...math, name: 'Trùng' }]);
    expect(parseCourses(raw)).toEqual([math]);
  });

  it('chuẩn hoá dữ liệu: bỏ khoảng trắng tên, làm tròn điểm, bỏ thuộc tính thừa', () => {
    const raw = JSON.stringify([{ id: 'x', name: '  Hoá  ', credits: 4, grade: 8.45, extra: 1 }]);
    expect(parseCourses(raw)).toEqual([{ id: 'x', name: 'Hoá', credits: 4, grade: 8.5 }]);
  });
});

describe('loadCourses', () => {
  it('chưa có dữ liệu → danh sách rỗng', () => {
    expect(loadCourses(memoryStorage())).toEqual([]);
  });

  it('đọc dữ liệu đã lưu theo key', () => {
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify([math]) });
    expect(loadCourses(storage)).toEqual([math]);
  });

  it('dữ liệu hỏng → danh sách rỗng, không ném lỗi', () => {
    const storage = memoryStorage({ [STORAGE_KEY]: '[{hỏng' });
    expect(loadCourses(storage)).toEqual([]);
  });

  it('localStorage bị chặn hoặc không có → danh sách rỗng, không ném lỗi', () => {
    expect(loadCourses(throwingStorage)).toEqual([]);
    expect(loadCourses(null)).toEqual([]);
  });
});

describe('saveCourses', () => {
  it('ghi JSON vào đúng key và đọc lại được', () => {
    const storage = memoryStorage();
    expect(saveCourses([math, physics], storage)).toBe(true);
    expect(JSON.parse(storage.data[STORAGE_KEY])).toEqual([math, physics]);
    expect(loadCourses(storage)).toEqual([math, physics]);
  });

  it('Xoá tất cả: lưu danh sách rỗng, tải lại được danh sách rỗng', () => {
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify([math]) });
    saveCourses([], storage);
    expect(storage.data[STORAGE_KEY]).toBe('[]');
    expect(loadCourses(storage)).toEqual([]);
  });

  it('ghi lỗi (bị chặn / đầy bộ nhớ) → trả về false, không ném lỗi', () => {
    expect(saveCourses([math], throwingStorage)).toBe(false);
    expect(saveCourses([math], null)).toBe(false);
  });
});
