const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();

const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];

let tasksEvents = JSON.parse(localStorage.getItem('calendarEvents')) || {};

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                     && currYear === new Date().getFullYear() ? "active" : "";
        let fullDate = `${currYear}-${String(currMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        let taskEventList = tasksEvents[fullDate] ? `<ul>${tasksEvents[fullDate].map(task => `<li>${task}</li>`).join('')}</ul>` : "";
        liTag += `<li class="${isToday}" data-date="${fullDate}">${i}${taskEventList}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
}

renderCalendar();

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if(currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }
        renderCalendar();
    });
});

// Add event listener for the booking form
document.getElementById('event-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const eventDate = document.getElementById('event-date').value;
    const eventTitle = document.getElementById('event-title').value;

    if (!tasksEvents[eventDate]) {
        tasksEvents[eventDate] = [];
    }
    tasksEvents[eventDate].push(eventTitle);

    // Save to localStorage
    localStorage.setItem('calendarEvents', JSON.stringify(tasksEvents));

    // Clear the form
    document.getElementById('event-title').value = '';

    // Re-render the calendar
    renderCalendar();
});

// Add event listener for clicking on a day
daysTag.addEventListener('click', function(e) {
    if (e.target.tagName === 'LI' && !e.target.classList.contains('inactive')) {
        document.getElementById('event-date').value = e.target.dataset.date;
    }
});