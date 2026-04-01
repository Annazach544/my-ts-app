interface Course {
  code: string;
  coursename: string;
  progression: string;
}
let courses: Course[] = [];

document.addEventListener("DOMContentLoaded", init);

function init(): void {
  console.log("Appen startar!");
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