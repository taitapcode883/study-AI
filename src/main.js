import './style.css';
import { validateCourseInput } from './logic/validation.js';
import { addCourse, createCourse, removeCourse, updateCourse } from './logic/courses.js';
import { convertGrade } from './logic/grading.js';
import { summarize } from './logic/gpa.js';

const FIELDS = ['name', 'credits', 'grade'];
const COLUMN_COUNT = 7;

const form = document.querySelector('#course-form');
const formTitle = document.querySelector('#form-title');
const submitButton = document.querySelector('#submit-button');
const rows = document.querySelector('#course-rows');
const inputs = {
  name: document.querySelector('#course-name'),
  credits: document.querySelector('#course-credits'),
  grade: document.querySelector('#course-grade'),
};
const errorEls = {
  name: document.querySelector('#error-name'),
  credits: document.querySelector('#error-credits'),
  grade: document.querySelector('#error-grade'),
};
const summaryEls = {
  courseCount: document.querySelector('#sum-courses'),
  totalCredits: document.querySelector('#sum-credits'),
  passedCredits: document.querySelector('#sum-passed'),
  gpa4: document.querySelector('#sum-gpa4'),
  gpa10: document.querySelector('#sum-gpa10'),
  classification: document.querySelector('#sum-class'),
};
const emptyHint = document.querySelector('#empty-hint');

let courses = [];
/** id của môn đang sửa trên form, null khi đang ở chế độ thêm. */
let editingId = null;

function setCourses(next) {
  courses = next;
  render();
}

function showErrors(errors) {
  for (const field of FIELDS) {
    const message = errors[field] ?? '';
    errorEls[field].textContent = message;
    inputs[field].setAttribute('aria-invalid', message ? 'true' : 'false');
  }
}

function renderTable() {
  rows.replaceChildren();

  if (courses.length === 0) {
    const row = rows.insertRow();
    const cell = row.insertCell();
    cell.colSpan = COLUMN_COUNT;
    cell.className = 'empty';
    cell.textContent = 'Chưa có môn học nào';
    return;
  }

  courses.forEach((course, index) => {
    const row = rows.insertRow();
    if (course.id === editingId) row.className = 'editing';
    const { letter, point4 } = convertGrade(course.grade);
    const cells = [
      [String(index + 1), ''],
      [course.name, 'name'],
      [String(course.credits), 'num'],
      [course.grade.toFixed(1), 'num'],
      [letter, 'num'],
      [point4.toFixed(1), 'num'],
    ];
    for (const [text, className] of cells) {
      const cell = row.insertCell();
      cell.textContent = text;
      if (className) cell.className = className;
    }

    const actions = row.insertCell();
    actions.className = 'actions';
    actions.append(
      actionButton('edit', 'Sửa', course),
      actionButton('delete', 'Xoá', course),
    );
  });
}

function actionButton(action, label, course) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `btn-small btn-${action}`;
  button.dataset.action = action;
  button.dataset.id = course.id;
  button.textContent = label;
  button.setAttribute('aria-label', `${label} môn ${course.name}`);
  return button;
}

function renderSummary() {
  const summary = summarize(courses);
  const empty = courses.length === 0;

  summaryEls.courseCount.textContent = String(summary.courseCount);
  summaryEls.totalCredits.textContent = String(summary.totalCredits);
  summaryEls.passedCredits.textContent = String(summary.passedCredits);
  summaryEls.gpa4.textContent = empty ? '—' : summary.gpa4.toFixed(2);
  summaryEls.gpa10.textContent = empty ? '—' : summary.gpa10.toFixed(2);
  summaryEls.classification.textContent = summary.classification ?? '—';
  emptyHint.hidden = !empty;
}

function render() {
  renderTable();
  renderSummary();
}

function resetForm() {
  editingId = null;
  form.reset();
  showErrors({});
  formTitle.textContent = 'Thêm môn học';
  submitButton.textContent = 'Thêm môn';
}

function startEdit(course) {
  editingId = course.id;
  inputs.name.value = course.name;
  inputs.credits.value = String(course.credits);
  inputs.grade.value = String(course.grade);
  showErrors({});
  formTitle.textContent = 'Sửa môn học';
  submitButton.textContent = 'Lưu';
  renderTable();
  inputs.name.focus();
}

function deleteCourse(course) {
  if (!window.confirm(`Xoá môn "${course.name}"?`)) return;
  if (course.id === editingId) resetForm();
  setCourses(removeCourse(courses, course.id));
}

rows.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const course = courses.find((item) => item.id === button.dataset.id);
  if (!course) return;

  if (button.dataset.action === 'edit') startEdit(course);
  if (button.dataset.action === 'delete') deleteCourse(course);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const result = validateCourseInput({
    name: inputs.name.value,
    credits: inputs.credits.value,
    grade: inputs.grade.value,
  });
  showErrors(result.errors);

  if (!result.valid) {
    const firstInvalid = FIELDS.find((field) => result.errors[field]);
    inputs[firstInvalid].focus();
    return;
  }

  const next = editingId
    ? updateCourse(courses, editingId, result.value)
    : addCourse(courses, createCourse(result.value));
  resetForm();
  setCourses(next);
  inputs.name.focus();
});

render();
