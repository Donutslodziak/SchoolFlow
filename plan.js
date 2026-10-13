
const days = [
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek"
];

const container = document.getElementById("lessonPlan");

let plan = JSON.parse(localStorage.getItem("schoolflowPlan")) || {};

function saveData() {
    container.querySelectorAll("input").forEach(input => {
        const key = input.dataset.key;
        const field = input.dataset.field;

        if (!plan[key]) {
            plan[key] = { time: "", subject: "" };
        }

        plan[key][field] = input.value;
    });

    localStorage.setItem("schoolflowPlan", JSON.stringify(plan));
}

function createPlan() {
    container.innerHTML = "";

    days.forEach(day => {
        const section = document.createElement("section");
        section.style.marginBottom = "30px";

        const heading = document.createElement("h2");
        heading.textContent = day;
        section.appendChild(heading);

        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";

        table.innerHTML = `
            <tr>
                <th style="padding:8px;border:1px solid #ccc">Lekcja</th>
                <th style="padding:8px;border:1px solid #ccc">Godziny</th>
                <th style="padding:8px;border:1px solid #ccc">Przedmiot</th>
            </tr>
        `;

        for (let i = 0; i <= 8; i++) {
            const key = day + "-" + i;
            const lesson = plan[key] || { time: "", subject: "" };
            const row = document.createElement("tr");

            const number = document.createElement("td");
            number.textContent = i;
            number.style.cssText =
                "padding:8px;border:1px solid #ccc;text-align:center";

            const timeCell = document.createElement("td");
            timeCell.style.cssText = "padding:4px;border:1px solid #ccc";

            const timeInput = document.createElement("input");
            timeInput.type = "text";
            timeInput.placeholder = "Np. 7:20-8:45";
            timeInput.value = lesson.time;
            timeInput.dataset.key = key;
            timeInput.dataset.field = "time";
            timeInput.style.cssText = "width:95%;box-sizing:border-box";

            const subjectCell = document.createElement("td");
            subjectCell.style.cssText = "padding:4px;border:1px solid #ccc";

            const subjectInput = document.createElement("input");
            subjectInput.type = "text";
            subjectInput.placeholder = "Wpisz przedmiot";
            subjectInput.value = lesson.subject;
            subjectInput.dataset.key = key;
            subjectInput.dataset.field = "subject";
            subjectInput.style.cssText = "width:95%;box-sizing:border-box";

            timeCell.appendChild(timeInput);
            subjectCell.appendChild(subjectInput);

            row.append(number, timeCell, subjectCell);
            table.appendChild(row);
        }

        section.appendChild(table);
        container.appendChild(section);
    });
}

container.addEventListener("input", saveData);

function savePlan() {
    saveData();
    alert("Plan lekcji zapisany! ✅");
}

createPlan();

container.addEventListener("keydown", function(event) {
    if (event.key !== "Enter") return;

    const inputs = Array.from(
        container.querySelectorAll("input")
    );

    const currentIndex = inputs.indexOf(event.target);

    if (currentIndex !== -1 && currentIndex < inputs.length - 1) {
        event.preventDefault();
        inputs[currentIndex + 1].focus();
    }
});
