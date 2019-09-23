scheActivities = [
  { Sunday: [] },
  { Monday: [] },
  { Tuesday: [] },
  { Wednesday: [] },
  { Thursday: [] },
  { Friday: [] },
  { Saturday: [] }
];
let activities = JSON.parse(localStorage.getItem("activities"));
activities = activities ? activities : scheActivities;
localStorage.setItem("activities", JSON.stringify(activities));
const btn = $(".schedule-activity-button-2"),
  quarterHours = ["00", "15", "30", "45"],
  daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
let timeReserved = timeReservedByDay();

let timesForSelection = calcTimesForSelection(),
  selectedActivity = "";

// ------------------------------HOME PAGE------------------------------
// ONLOAD
$(document).ready(() => {
  onLoad();
});
// EVENT:click (Schedule Activity) BUTTON
$(".schedule-activity-button").click(() => {
  clickOnScheduledBtn();
});
// ------------------------------SECOND PAGE------------------------------

// EVENT:click (X) BUTTON
$("#back-btn").click(() => {
  clickOnXBtn();
});

// EVENT:click (Activity SURFING) BUTTON
$(".surf").click(() => {
  clickOnActivityBtn("surf");
});
// EVENT:click (Activity HIKING) BUTTON
$(".hike").click(() => {
  clickOnActivityBtn("hike");
});
// EVENT:click (Activity WEIGHTS) BUTTON
$(".weights").click(() => {
  clickOnActivityBtn("weights");
});
// EVENT:click (Activity SPINNING) BUTTON
$(".spin").click(() => {
  clickOnActivityBtn("spin");
});

// EVENT:onchange (Time-selector) SELECT
$(".select-time").change(() => {
  changeTimeSelector();
});
// EVENT:onchange (Date-selector) SELECT
$(".select-date").change(() => {
  changeDateSelector();
});
// EVENT:onchange (Duration-selector) SELECT

$(".select-duration").change(() => {
  if ($(".select-date").val()) {
    changeDateSelector();
  }
});
// EVENT:click (Activated Schedule) BUTTON
btn.click(() => clickOnActivScheduledBtn());

//------------------------------FUNCTIONS------------------------------
// Function for getting times available vo selection
function calcTimesForSelection() {
  let timesForSelect = [];
  for (let i = 8; i < 22; i++) {
    for (let j = 0; j < 4; j++) {
      let time = i + ":" + quarterHours[j];
      if (i < 10) {
        time = "0" + time;
      }
      timesForSelect.push(time);
    }
  }
  return timesForSelect;
}
// function for rendering the Home Page
function onLoad() {
  const timeSelector = $(".select-time");
  if (sortByDate().length > 0) {
    showScheduledActivities();
  } else {
    $("#container-2").hide();
    $("#footer-3").hide();
  }

  timesForSelection.forEach(time => {
    timeSelector.append(`<option value="${time}">${time}</option>`);
  });
}
function clickOnScheduledBtn() {
  $("#container").slideUp("fast");

  $("#container-2").show();
}
// Function for Setting the Date Picker
$(function() {
  $("#datepicker").datepicker({
    // minDate: 1,
    // maxDate: "+1w"
  });
});
// Function for click on X Button
function clickOnXBtn() {
  $("#container-2").slideUp();

  $("#container").show("fast");
}
// Function for sorting the time available
function timeReservedByDay() {
  const date_ = new Date();
  const year = date_.getFullYear();
  let timesByDay = [
    { Sunday: [] },
    { Monday: [] },
    { Tuesday: [] },
    { Wednesday: [] },
    { Thursday: [] },
    { Friday: [] },
    { Saturday: [] }
  ];

  for (let i = 0; i < daysOfWeek.length; i++) {
    for (let j = 0; j < activities[i][daysOfWeek[i]].length; j++) {
      let date = new Date(
        `${year} ${activities[i][daysOfWeek[i]][j].date}`
      ).getTime();
      if (date > date_.getTime()) {
        let obj = {
          start: activities[i][daysOfWeek[i]][j].startingTime,
          end: activities[i][daysOfWeek[i]][j].endingTime
        };
        timesByDay[i][daysOfWeek[i]].push(obj);
      }
    }
  }

  return timesByDay;
}
// Function for onchange on Time Selector
function changeTimeSelector() {
  const date = $("#datepicker").datepicker("getDate");
  if (selectedActivity && date) {
    activateScheduleBtn();
  }
}
// Function for onchange on Date Selector
function changeDateSelector() {
  // const times = timeAvailable();
  const time = $(".select-time").val();
  const day =
    daysOfWeek[
      $("#datepicker")
        .datepicker("getDate")
        .getDay()
    ];
  timeReserved = timeReservedByDay();

  if (timeReserved[daysOfWeek.indexOf(day)][day].length > 0) {
    $(".select-time")
      .children()
      .remove();
    timesForSelection = [];

    availableTime(day);

    timesForSelection.forEach(time => {
      $(".select-time").append(`<option value="${time}">${time}</option>`);
    });
  } else {
    timesForSelection = calcTimesForSelection();

    $(".select-time")
      .children()
      .remove();

    for (let i = 0; i < timesForSelection.length; i++) {
      $(".select-time").append(
        `<option value="${timesForSelection[i]}">${timesForSelection[i]}</option>`
      );
    }
  }
  if (selectedActivity && time) {
    activateScheduleBtn();
  }
}
// Function for activating SCHEDULE BUTTON
function activateScheduleBtn() {
  btn.addClass("activated");
}
// Function for click on Activated Scheduled Button
function clickOnActivScheduledBtn() {
  if (!selectedActivity) return;

  const getDate = $(".select-date").datepicker("getDate");
  const dayNames = $(".select-date").datepicker("option", "dayNames");
  const monthNames = $(".select-date").datepicker("option", "monthNames");
  //---------------------------------
  const activity = selectedActivity;
  let duration = $(".select-duration").val();
  const month = monthNames[getDate.getMonth()];
  const date = getDate.getDate();
  const day = dayNames[getDate.getDay()];
  const time = $(".select-time").val();

  startingTime = time.split(":");
  const r = /\d+/g;
  duration = duration.match(r);

  let endMinutes;
  if (duration.length === 2) {
    endMinutes =
      parseInt(startingTime[0]) * 60 +
      parseInt(duration[0]) * 60 +
      parseInt(startingTime[1]) +
      parseInt(duration[1]);
  } else {
    endMinutes =
      parseInt(startingTime[0]) * 60 +
      parseInt(duration[0]) +
      parseInt(startingTime[1]);
  }
  let hours = `${Math.floor(endMinutes / 60)}`;
  let minutes = `${endMinutes % 60}`;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes == 0) {
    minutes = "00";
  }

  const endingTime = `${hours}:${minutes}`;

  const activitiess = {
    activity: activity,
    date: `${month} ${date}`,
    startingTime: time,
    endingTime: endingTime,
    day: day
  };
  activities[getDate.getDay()][`${day}`].push(activitiess);
  localStorage.setItem("activities", JSON.stringify(activities));

  clickOnXBtn();
  changeDateSelector();
  resetScheduleForm();
  showScheduledActivities();
  deactivateScheduleBtn();
}

// Function for click on Activity BUTTON
function clickOnActivityButton(className) {
  const element = $(`.${className}`);
  element.toggleClass("selected");
  if (element.attr("class").indexOf("selected") > -1) {
    element
      .empty()
      .append(
        `<img src="/pics/activity icons white/${className}-white.png" alt="${className}" class="activity-icon-2"/>`
      );
    selectedActivity = className;
  } else {
    element
      .empty()
      .append(
        `<img src="/pics/activity icons/${className}.png" alt="${className}" class="activity-icon-2"/>`
      );
    selectedActivity = "";
  }
  if ($(".select-time").val() && selectedActivity && $("#datepicker").val()) {
    activateScheduleBtn();
  } else if ($(".select-time").val()) {
    deactivateScheduleBtn();
  }
}

// Function for deactivating SCHEDULE BUTTON
function deactivateScheduleBtn() {
  btn.removeClass("activated");
}
// Function for showing the scheduled activities on UI
function showScheduledActivities() {
  $("#footer").hide();
  $("#container-2").hide();
  $("#footer-3").show();
  $("#scheduled-activities-heading-2")
    .children()
    .remove();
  const sortedData = sortByDate();

  for (let i = 0; i < sortedData.length; i++) {
    if (!sortedData[i - 1] || sortedData[i].date !== sortedData[i - 1].date) {
      const year = new Date().getFullYear();
      let activityDate = sortedData[i].date;
      let activityHours = sortedData[i].startingTime;
      let activityTime = new Date(
        `${activityDate} ${year} ${activityHours}`
      ).getTime();

      if (new Date().getTime() < activityTime) {
        createScrollMenu(sortedData, i);

        addingScheToMenu(sortedData, i);
      }
    } else {
      addingScheToMenu(sortedData, i);
    }
  }
}
// Function for Sorting the DATA by Date
function sortByDate() {
  let sortedData = [];
  for (let i = 0; i < daysOfWeek.length; i++) {
    if (activities[i][daysOfWeek[i]].length > 0) {
      activities[i][daysOfWeek[i]].forEach(function(e) {
        sortedData.push(e);
      });
    }
  }
  sortedData.sort(function(a, b) {
    let da = new Date(`${a.date}, 2019 ${a.startingTime}`).getTime();
    let db = new Date(`${b.date}, 2019 ${b.startingTime}`).getTime();

    return da < db ? -1 : da > db ? 1 : 0;
  });

  return sortedData;
}
// Function for click on Activity BUTTON
function clickOnActivityBtn(activity) {
  if (selectedActivity === activity || selectedActivity === "") {
    clickOnActivityButton(activity);
  } else {
    clickOnActivityButton(selectedActivity);
    clickOnActivityButton(activity);
  }
}
// Function for calculating time between activities
function availableTime(day) {
  const r = /\d+/g,
    date_ = new Date(),
    month = months[date_.getMonth()],
    date = date_.getDate(),
    year = date_.getFullYear();
  let duration = $(".select-duration").val();
  let timeReservedSorted = timeReserved[daysOfWeek.indexOf(day)][day].sort(
    function(a, b) {
      let da = new Date(`${month} ${date} ${year} ${a.start}`).getTime();
      let db = new Date(`${month} ${date} ${year} ${b.start}`).getTime();
      return da < db ? -1 : da > db ? 1 : 0;
    }
  );

  duration = duration.match(r);
  if (duration.length === 2) {
    duration = parseInt(duration[0]) * 60 + parseInt(duration[1]);
  } else {
    duration = parseInt(duration[0]);
  }

  // if (timeReservedSorted.length > 0) {
  let startTime = timeReservedSorted[0];

  startTime = startTime.start;

  startTime = startTime.match(r);
  startTime = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
  let eightOclock = 480;
  calcFreeSlots(startTime, eightOclock, duration);

  for (let i = 1; i < timeReservedSorted.length + 1; i++) {
    let end = timeReservedSorted[i - 1];
    end = end.end;
    end = end.match(r);
    end = parseInt(end[0]) * 60 + parseInt(end[1]);
    if (i === timeReservedSorted.length) {
      let start = 1320;

      calcFreeSlots(start, end, duration);
    } else {
      let start = timeReservedSorted[i];

      start = start.start;
      start = start.match(r);
      start = parseInt(start[0]) * 60 + parseInt(start[1]);

      calcFreeSlots(start, end, duration);
    }
  }
}
// Function for calculating free slots(times)
function calcFreeSlots(start, end, dur) {
  let timeBetweenActivities = start - end;

  if (dur <= timeBetweenActivities) {
    const time = twoDigitsTime(end);

    timesForSelection.push(time);
    if (timeBetweenActivities / dur >= 2) {
      const moreSlots = Math.floor(timeBetweenActivities / dur);

      for (let i = 1; i < moreSlots; i++) {
        end += dur;
        const time = twoDigitsTime(end);

        timesForSelection.push(time);
      }
    }
  }
}
// Function for showing time with 2 digits
function twoDigitsTime(end) {
  let hours = `${Math.floor(end / 60)}`;
  let minutes = `${end % 60}`;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes == 0) {
    minutes = "00";
  }
  return `${hours}:${minutes}`;
}
// Function for reseting the Forms
function resetScheduleForm() {
  $(`.${selectedActivity}`).removeClass("selected");
  $(`.${selectedActivity}`)
    .empty()
    .append(
      `<img src="/pics/activity icons/${selectedActivity}.png" alt="${selectedActivity}" class="activity-icon-2"/>`
    );
  selectedActivity = "";
  $(".select-duration").val("15 min");
  $("#datepicker").val("");
}

// function for adding the Scheduled Activities to the Scroll Menu
function addingScheToMenu(data, i) {
  let div2 = $("<div></div>");
  let div_time = $("<div></div>");
  div_time.addClass("starting-time");

  div_time.text(`${data[i].startingTime}`);

  div2.addClass("filled-slot scroll-item");

  div2.append(
    `<img src='/pics/activity icons/${data[i].activity}.png' class='filled-img'>`
  );
  let div_wrapper = $("<div></div>");
  div_wrapper.addClass("cheduled-activities-wrapper");
  div_wrapper.append(div2);
  div_wrapper.append(div_time);

  $(`.${data[i].day}`)
    .children(".empty")
    .last()
    .remove();

  if (
    $(`.${data[i].day}`).children(".cheduled-activities-wrapper").length > 0
  ) {
    div_wrapper.insertAfter($(".cheduled-activities-wrapper").last());
  } else {
    $(`.${data[i].day}`).prepend(div_wrapper);
  }
}
// Function for creating the Scroll Menu for the Scheduled Activities
function createScrollMenu(data, i) {
  let div = $("<div></div>");

  div.addClass("scheduled-activities-container");
  div.append(`<div class="month-and-date">${data[i].date}</div>
      <div class="day-of-week">${data[i].day}</div>
      <div class="scrollmenu ${data[i].day}" >
        <div class="scheduled-activities-wrapper empty" >
          <div class="empty-slot scroll-item"></div><div class="starting-time"></div>
        </div>
        <div class="scheduled-activities-wrapper empty">
          <div class="empty-slot scroll-item"></div><div class="starting-time"></div>
        </div>
        <div class="scheduled-activities-wrapper empty">
          <div class="empty-slot scroll-item"></div><div class="starting-time"></div>
        </div>
        <div class="scheduled-activities-wrapper" empty>
          <div class="empty-slot scroll-item"></div><div class="starting-time"></div>
        </div>
        <div class="scheduled-activities-wrapper empty">
          <div class="empty-slot scroll-item"></div><div class="starting-time"></div>
        </div>
        
      </div>
      
      
      `);
  $("#scheduled-activities-heading-2").append(div);
}
