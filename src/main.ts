import './style.css';

interface Course {
  code: string;
  coursename: string;
  progression: 'A' | 'B' | 'C';
  syllabus: string;
}

let courses: Course[] = [];
let sortOrder: boolean = true;

document.addEventListener("DOMContentLoaded", init);

async function init(): Promise<void> {
  console.log("Appen startar!");
  await fetchCourses();
  loadCourses();
  fillTable();

  // Koppla sökfält
  const searchInput = document.querySelector<HTMLInputElement>("#searchInput");
  searchInput?.addEventListener("input", () => {
    fillTable(searchInput.value);
  });
}

async function fetchCourses(): Promise<void> {
  try {
    const response = await fetch("/ramschema.json");

    if (!response.ok) {
      throw new Error("Fel vid hämtning");
    }

    courses = await response.json() as Course[];
    console.log(courses);

  } catch (error) {
    console.error("Fel:", error);
  }
}

function fillTable(filter: string = ""): void {
  const tableBody = document.querySelector<HTMLTableSectionElement>("#courseTable");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  courses
    .filter(course =>
      course.code.toLowerCase().includes(filter.toLowerCase()) ||
      course.coursename.toLowerCase().includes(filter.toLowerCase())
    )
    .forEach(course => {
      const row = document.createElement("tr");

      const codeCell = document.createElement("td");
      codeCell.textContent = course.code;
      row.appendChild(codeCell);

      const nameCell = document.createElement("td");
      nameCell.textContent = course.coursename;
      row.appendChild(nameCell);

      const progCell = document.createElement("td");
      progCell.textContent = course.progression;
      row.appendChild(progCell);

      tableBody.appendChild(row);
    });
}

function sortTable(key: keyof Course): void {
  courses.sort((a, b) => {
    if (a[key] < b[key]) return sortOrder ? -1 : 1;
    if (a[key] > b[key]) return sortOrder ? 1 : -1;
    return 0;
  });

  sortOrder = !sortOrder;
  fillTable();
}
const headers = document.querySelectorAll<HTMLTableCellElement>("th[data-sort]");
headers.forEach(header => {
  header.addEventListener("click", () => {
    const sortKey = header.getAttribute("data-sort") as keyof Course;
    sortTable(sortKey);
  });
});
function saveCourses(): void {
  localStorage.setItem('courses', JSON.stringify(courses));
}

function loadCourses(): void {
  const data = localStorage.getItem('courses');
  if (data) courses = JSON.parse(data) as Course[];
}

function addCourse(event: Event): void {
  event.preventDefault();

  const codeInput = document.querySelector<HTMLInputElement>('#courseCode')!;
  const nameInput = document.querySelector<HTMLInputElement>('#courseName')!;
  const progSelect = document.querySelector<HTMLSelectElement>('#courseProgression')!;
  const syllabusInput = document.querySelector<HTMLInputElement>('#courseSyllabus')!;

  const newCourse: Course = {
    code: codeInput.value.trim(),
    coursename: nameInput.value.trim(),
    progression: progSelect.value as 'A' | 'B' | 'C',
    syllabus: syllabusInput.value.trim(),
  };

  if (courses.some(c => c.code === newCourse.code)) {
    alert('Kurskoden finns redan!');
    return;
  }

  courses.push(newCourse);
  saveCourses();
  fillTable();

  codeInput.value = '';
  nameInput.value = '';
  progSelect.value = '';
  syllabusInput.value = '';
}

const form = document.querySelector<HTMLFormElement>('#addCourseForm');
form?.addEventListener('submit', addCourse);
