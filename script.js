let events = JSON.parse(localStorage.getItem("schoolflowEvents") || "[]");
let shownMonth = new Date().getMonth();
let shownYear = new Date().getFullYear();

const colors = {
    test: "#ef4444",
    quiz: "#f59e0b",
    homework: "#3b82f6",
    other: "#8b5cf6"
};

const typeNames = {
    test: "Sprawdzian",
    quiz: "Kartkówka",
    homework: "Zadanie domowe",
    other: "Inne"
};

const style = document.createElement("style");
style.textContent = `
    #calendar { margin: 20px 0; }
    .calendar-top { display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:15px; flex-wrap:wrap; }
    .calendar-grid { display:grid; grid-template-columns:repeat(7,minmax(0,1fr)); gap:5px; }
    .calendar-day-name { text-align:center; font-weight:bold; padding:8px 0; }
    .calendar-cell { min-height:100px; border:1px solid #ddd; border-radius:8px; padding:5px; min-width:0; background:white; color:#222; }
    .calendar-cell.today { border:2px solid #16a34a; }
    .day-number { font-weight:bold; margin-bottom:5px; }
    .event-tag { color:white; padding:4px; border-radius:5px; margin:4px 0; font-size:12px; overflow-wrap:anywhere; }
    .event-tag button { float:right; padding:0 4px; margin-left:3px; background:rgba(0,0,0,.2); color:white; }
    .event-card { padding:12px; border-radius:8px; margin:10px 0; border-left:6px solid; background:#f7f7f7; color:#222; }
    .event-card button { margin-top:8px; }
    @media(max-width:600px) {
        .calendar-grid { gap:2px; }
        .calendar-cell { min-height:65px; padding:3px; }
        .event-tag { font-size:10px; padding:3px; }
        .calendar-day-name { font-size:11px; }
    }
`;
document.head.appendChild(style);

const eventList = document.getElementById("eventList");
const heading = eventList.previousElementSibling;

const calendar = document.createElement("section");
calendar.id = "calendar";
heading.parentNode.insertBefore(calendar, heading);

function saveEvents() {
    localStorage.setItem("schoolflowEvents", JSON.stringify(events));
}

function localDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function addEvent(event) {
    event.preventDefault();

    const title = document.getElementById("eventTitle").value.trim();
    const date = document.getElementById("eventDate").value;
    const type = document.getElementById("eventType").value;
    const subject = document.getElementById("eventSubject").value.trim();

    if (!title || !date) return;

    events.push({
        id: Date.now() + Math.random(),
        title,
        date,
        type,
        subject
    });

    saveEvents();
    renderCalendar();
    renderEventList();

    document.getElementById("eventForm").reset();
}

function deleteEvent(id) {
    events = events.filter(event => event.id !== id);
    saveEvents();
    renderCalendar();
    renderEventList();
}

function renderCalendar() {
    const firstDay = new Date(shownYear, shownMonth, 1);
    const daysInMonth = new Date(shownYear, shownMonth + 1, 0).getDate();
    const offset = (firstDay.getDay() + 6) % 7;
    const today = localDateString(new Date());

    calendar.innerHTML = `
        <div class="calendar-top">
            <button id="prevMonth">← Poprzedni</button>
            <h2>${new Date(shownYear, shownMonth).toLocaleDateString("pl-PL", {month:"long", year:"numeric"})}</h2>
            <button id="nextMonth">Następny →</button>
        </div>
        <div class="calendar-grid" id="calendarGrid">
            ${["Pon","Wt","Śr","Czw","Pt","Sob","Niedz"].map(day =>
                `<div class="calendar-day-name">${day}</div>`
            ).join("")}
        </div>
    `;

    document.getElementById("prevMonth").onclick = () => {
        shownMonth--;
        if (shownMonth < 0) {
            shownMonth = 11;
            shownYear--;
        }
        renderCalendar();
    };

    document.getElementById("nextMonth").onclick = () => {
        shownMonth++;
        if (shownMonth > 11) {
            shownMonth = 0;
            shownYear++;
        }
        renderCalendar();
    };

    const grid = document.getElementById("calendarGrid");

    for (let i = 0; i < offset; i++) {
        grid.insertAdjacentHTML("beforeend", "<div></div>");
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = localDateString(new Date(shownYear, shownMonth, day));
        const cell = document.createElement("div");
        cell.className = "calendar-cell" + (date === today ? " today" : "");

        const number = document.createElement("div");
        number.className = "day-number";
        number.textContent = day;
        cell.appendChild(number);

        events.filter(event => event.date === date).forEach(event => {
            const tag = document.createElement("div");
            tag.className = "event-tag";
            tag.style.background = colors[event.type] || colors.other;

            const title = document.createElement("span");
            title.textContent = event.title;
            tag.appendChild(title);

            cell.appendChild(tag);
        });

        grid.appendChild(cell);
    }
}

function renderEventList() {
    eventList.innerHTML = "";

    const sorted = [...events].sort((a, b) =>
        a.date.localeCompare(b.date)
    );

    if (sorted.length === 0) {
        eventList.textContent = "Nie masz jeszcze wydarzeń. Dodaj pierwsze powyżej! 📚";
        return;
    }

    sorted.forEach(event => {
        const card = document.createElement("div");
        card.className = "event-card";
        card.style.borderLeftColor = colors[event.type] || colors.other;

        const title = document.createElement("strong");
        title.textContent = event.title;
        card.appendChild(title);

        const details = document.createElement("p");
        details.textContent =
            `${event.date} • ${typeNames[event.type] || "Inne"}` +
            (event.subject ? ` • ${event.subject}` : "");
        card.appendChild(details);

        const remove = document.createElement("button");
        remove.textContent = "Usuń";
        remove.onclick = () => deleteEvent(event.id);
        card.appendChild(remove);

        eventList.appendChild(card);
    });
}

document.getElementById("eventForm").addEventListener("submit", addEvent);

renderCalendar();
renderEventList();