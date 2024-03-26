function checkForCanadianHolidays(month, day) {
  const holidayRanges = [
    { name: 'Winter Break', startMonth: 12, startDay: 25, endMonth: 1, endDay: 5 },
    { name: 'Spring Break', startMonth: 3, startDay: 9, endMonth: 3, endDay: 15 },
    { name: 'Summer Break', startMonth: 6, startDay: 29, endMonth: 9, endDay: 7 }
  ];

  for (const holidayRange of holidayRanges) {
    const { name, startMonth, startDay, endMonth, endDay } = holidayRange;

    if (
      (month === startMonth && day >= startDay && month === endMonth && day <= endDay) ||
      (month === startMonth && day >= startDay && month !== endMonth) ||
      (month === endMonth && day <= endDay && month !== startMonth)
    ) {
      return `(${name})`;
    }
  }

  return '';
}


function checkWeek() {
  let day = parseInt(document.getElementById('day').value);
  let month = parseInt(document.getElementById('month').value);
  let year = parseInt(document.getElementById('year').value);

  const daysInMonth = new Date(year, month, 0).getDate();
  day = validateInput(day, 1, daysInMonth);
  month = validateInput(month, 1, 12);
  year = validateInput(year, 2000, 2100);

  const isInvalidDay = day < 1 || day > daysInMonth;
  const isInvalidMonth = month < 1 || month > 12;
  const isInvalidYear = year < 2000 || year > 2100;

  // if (isInvalidDay || isInvalidMonth || isInvalidYear) {
  //   console.log("this happens")
  //   document.container.style.backgroundColor = 'red';
  //   return;
  // }

  //document.body.style.backgroundColor = '';

  const date = new Date(year, month - 1, day);
  const weekNumber = getWeekNumber(date);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  const resultDiv = document.getElementById('cdOrDc');
  resultDiv.innerText = weekNumber % 2 === 0 ? 'DC' : 'CD';

  const holiday = checkForCanadianHolidays(month, day);
  if (holiday !== '') {
    resultDiv.innerText += ` ${holiday}`;
  }
  if (isWeekend === true) {
    resultDiv.innerText += ` (Weekend)`;
  }

  resultDiv.style.opacity = '1';
  resultDiv.style.transform = 'translateY(0)';

  updateBackground(weekNumber, isWeekend);
}

function fillCurrentDate() {
  const today = new Date();
  document.getElementById('day').value = today.getDate();
  document.getElementById('month').value = today.getMonth() + 1;
  document.getElementById('year').value = today.getFullYear();

  checkWeek();
}

function validateInput(value, min, max) {
  if (isNaN(value)) {
    return min;
  } else if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  }
  return value;
}

function getWeekNumber(date) {
  const referenceDate = new Date(2024, 3, 26);
  const diffInTime = date.getTime() - referenceDate.getTime();
  const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
  return Math.floor(diffInDays / 7) + 1;
}

function updateBackground(weekNumber, isWeekend) {
  const body = document.querySelector('body');
  const isHoliday = checkForCanadianHolidays(new Date().getMonth() + 1, new Date().getDate());

  if (weekNumber % 2 === 0) {
    body.className = isWeekend ? 'dc-weekend bg-warning' : 'dc-week bg-info';
    if (isHoliday !== '') {
      body.className += ' holiday';
    }
  } else {
    body.className = isWeekend ? 'cd-weekend bg-warning' : 'cd-week bg-success';
    if (isHoliday !== '') {
      body.className += ' holiday';
    }
  }
}

window.onload = function() {
  fillCurrentDate();
  checkWeek();

  const dayInput = document.getElementById('day');
  const monthInput = document.getElementById('month');
  const yearInput = document.getElementById('year');

  const handleEnterKey = function(event) {
    if (event.key === 'Enter') {
      checkWeek();
      event.target.blur();
    }
  };

  dayInput.addEventListener('keyup', handleEnterKey);

  // Prevent Pinch Zoom
document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
    document.body.style.zoom = 0.99;
});

document.addEventListener("gesturechange", function (e) {
  e.preventDefault();

  document.body.style.zoom = 0.99;
});
document.addEventListener("gestureend", function (e) {
    e.preventDefault();
    document.body.style.zoom = 1;
});
  monthInput.addEventListener('keyup', handleEnterKey);
  yearInput.addEventListener('keyup', handleEnterKey);
};
