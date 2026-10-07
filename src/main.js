import './style.css';
import { validateCourseInput } from './logic/validation.js';
import { addCourse, createCourse } from './logic/courses.js';

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
    cell.colSpan = 4;
    cell.className = 'empty';
    cell.textContent = 'Chưa có môn học nào';
    return;
  }

  courses.forEach((course, index) => {
    const row = rows.insertRow();
    const cells = [
      [String(index + 1), ''],
      [course.name, 'name'],
      [String(course.credits), 'num'],
      [course.grade.toFixed(1), 'num'],
    ];
    for (const [text, className] of cells) {
      const cell = row.insertCell();
      cell.textContent = text;
      if (className) cell.className = className;
    }
  });
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
  renderTable();
  form.reset();
  inputs.name.focus();
});

renderTable();
