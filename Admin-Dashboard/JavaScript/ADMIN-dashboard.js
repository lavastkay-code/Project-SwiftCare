const today = new Date();
const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const days = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"
];

document.getElementById("currentDate").innerHTML = 
  `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()} | ${days[today.getDay()]}`;

const toggleButtons = document.querySelectorAll(".nav-toggle");

toggleButtons.forEach((btn) => {
  const parentItem = btn.closest(".has-submenu");

  btn.addEventListener("click", () => {
    const isOpen = parentItem.classList.toggle("open");
    btn.setAttribute("aria-expanded", isOpen);
  });
});

const patientPopup = document.getElementById("patient-popup");
const openPatientBtn = document.getElementById("openPatientPopup");
const closePatientBtn = document.getElementById("closePatientPopup");

if (openPatientBtn && patientPopup) {
  openPatientBtn.addEventListener("click", () => {
    patientPopup.showModal();
  });
}

if (closePatientBtn && patientPopup) {
  closePatientBtn.addEventListener("click", () => {
    patientPopup.close();
  });
}

if (patientPopup) {
  patientPopup.addEventListener("click", (e) => {
    if (e.target === patientPopup) {
      patientPopup.close();
    }
  });
}

const profile = document.querySelector(".profile");

if (profile) {
  profile.addEventListener("click", () => {
    profile.classList.toggle("active");
  });
}

const patientMenu = document.querySelector(".has-submenu");

if (patientMenu) {
  const menuToggle = patientMenu.querySelector(".menu-toggle");

  if (menuToggle) {
    menuToggle.addEventListener("click", function (e) {
      e.preventDefault();
      patientMenu.classList.toggle("active");
    });
  }
}