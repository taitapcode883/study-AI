import './style.css';
import { validateCourseInput } from './logic/validation.js';
import { addCourse, createCourse } from './logic/courses.js';
import { convertGrade } from './logic/grading.js';
import { summarize } from './logic/gpa.js';

const FIELDS = ['name', 'credits', 'grade'];

const form = document.querySelector('#course-form');
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
    cell.colSpan = 6;
    cell.className = 'empty';
    cell.textContent = 'Chưa có môn học nào';
    return;
  }

  courses.forEach((course, index) => {
    const row = rows.insertRow();
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
  });
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

  courses = addCourse(courses, createCourse(result.value));
  render();
  form.reset();
  inputs.name.focus();
});

render();
