const fs = require("fs");

let newData = {};

// Define the formatTime function
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
}

// Define the padZero function
function padZero(number) {
  return number < 10 ? `0${number}` : number;
}

function saveToLocalStorage(newData) {
  let data = [];
  try {
    data = JSON.parse(fs.readFileSync("count.json"));
  } catch (error) {
    console.error("Error loading data from local storage:", error);
  }

  data.push(newData);

  console.log(data);

  fs.writeFileSync("count.json", JSON.stringify(data), { flag: "w" });
}

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // Months are 0-indexed
  const day = today.getDate();
  return `${year}-${padZero(month)}-${padZero(day)}`;
}

function loadFromLocalStorage() {
  try {
    let data = JSON.parse(fs.readFileSync("count.json"));
    let totalTime =
      data[data.length - 1].totalTime !== undefined
        ? data[data.length - 1].totalTime
        : 0;
    let currentDate =
      data[data.length - 1].currentDate !== undefined
        ? data[data.length - 1].currentDate
        : getCurrentDate();
    let dailyTimes =
      data[data.length - 1].dailyTimes !== undefined
        ? data[data.length - 1].dailyTimes
        : 0;

    if (currentDate != getCurrentDate()) {
      dailyTimes = 0;
      currentDate = getCurrentDate();
    }
    let sessionTime = 0;

    return { totalTime, dailyTimes, sessionTime, currentDate };
  } catch (error) {
    console.error("Error loading data from local storage:", error);

    return {
      totalTime: 0,
      dailyTimes: 0,
      sessionTime: 0,
      currentDate: getCurrentDate(),
    };
  }
}

function updateStopwatch() {
  let { totalTime, dailyTimes, sessionTime, currentDate } =
    loadFromLocalStorage();

  sessionStartTime = Math.floor(new Date().getTime() / 1000);

  setInterval(() => {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    const elapsedSessionTime = currentTime - sessionStartTime;
    sessionTime += elapsedSessionTime;
    totalTime += elapsedSessionTime;
    dailyTimes += elapsedSessionTime;

    sessionStartTime = currentTime;

    newData = {
      totalTime,
      dailyTimes,
      sessionTime,
      currentDate,
    };

    const formattedTotalTime = formatTime(totalTime);
    const formattedDailyTime = formatTime(dailyTimes);
    const formattedSessionTime = formatTime(sessionTime);

    updateDateTimeInfo();

    console.log("Total Time:", formattedTotalTime);
    console.log("Daily Time:", formattedDailyTime);
    console.log("Session Time:", formattedSessionTime);
  }, 1000);
}

// Function to get the weekday name
function getWeekday(dayIndex) {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekdays[dayIndex];
}

// Function to format real-time as HH:MM:SS
function formatRealTime(date) {
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
}

// Function to add a leading zero if the number is less than 10
function padZero(number) {
  return number < 10 ? `0${number}` : number;
}

function updateDateTimeInfo() {
  const currentDate = new Date();
  const weekday = getWeekday(currentDate.getDay());
  const realTime = formatRealTime(currentDate);
  console.log(weekday, " : ", realTime);
}

updateStopwatch();

process.on("SIGINT", () => {
  saveToLocalStorage(newData);
  // Your cleanup code here
  process.exit();
});
