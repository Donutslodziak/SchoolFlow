let grades = JSON.parse(localStorage.getItem("schoolflowGrades")) || [];

function addGrade() {
    const subjectInput = document.getElementById("subjectInput");
    const gradeInput = document.getElementById("gradeInput");

    const subject = subjectInput.value.trim();
    const grade = Number(gradeInput.value);

    if (subject === "") {
        alert("Wpisz nazwę przedmiotu!");
        subjectInput.focus();
        return;
    }

    grades.push({
        subject: subject,
        grade: grade
    });

    localStorage.setItem("schoolflowGrades", JSON.stringify(grades));

    subjectInput.value = "";
    renderGrades();
}

function deleteGrade(index) {
    grades.splice(index, 1);
    localStorage.setItem("schoolflowGrades", JSON.stringify(grades));
    renderGrades();
}

function renderGrades() {
    const gradeList = document.getElementById("gradeList");
    gradeList.innerHTML = "";

    if (grades.length === 0) {
        gradeList.textContent = "Nie masz jeszcze żadnych ocen.";
        return;
    }

    const subjects = {};

    grades.forEach(function(item, index) {
        if (!subjects[item.subject]) {
            subjects[item.subject] = [];
        }

        subjects[item.subject].push({
            grade: item.grade,
            index: index
        });
    });

    Object.keys(subjects).forEach(function(subject) {
        const section = document.createElement("div");
        section.style.marginBottom = "20px";

        const heading = document.createElement("h3");
        heading.textContent = subject;
        section.appendChild(heading);

        let sum = 0;

        subjects[subject].forEach(function(item) {
            sum += item.grade;

            const line = document.createElement("p");
            line.textContent = "Ocena: " + item.grade + " ";

            const button = document.createElement("button");
            button.textContent = "Usuń";
            button.style.marginLeft = "8px";

            button.addEventListener("click", function() {
                deleteGrade(item.index);
            });

            line.appendChild(button);
            section.appendChild(line);
        });

        const average = document.createElement("p");
        average.textContent =
            "Średnia: " + (sum / subjects[subject].length).toFixed(2);

        average.style.fontWeight = "bold";
        average.style.color = "#217346";

        section.appendChild(average);
        gradeList.appendChild(section);
    });
}

renderGrades();