interface Course {
  code: string;
  coursename: string;
  progression: string;
}
let courses: Course[] = [];

document.addEventListener("DOMContentLoaded", init);

async function init(): Promise<void> {
  console.log("Appen startar!");
  await fetchCourses(); 
  fillTable();
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
function fillTable(): void {
  const tableBody = document.querySelector<HTMLTableSectionElement>("#courseTable");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  courses.forEach(course => {
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