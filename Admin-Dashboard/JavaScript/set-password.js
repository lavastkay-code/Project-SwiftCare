const API_BASE_URL = "https://swiftcare-backend-production-2ea4.up.railway.app/api";

const form = document.getElementById("signupForm");

const clinicName = document.getElementById("clinicName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const state = document.getElementById("state");

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirm = document.getElementById("toggleConfirm");

const strengthText = document.getElementById("strengthText");
const strengthFill = document.getElementById("strengthFill");

const ruleLength = document.getElementById("ruleLength");
const ruleUpper = document.getElementById("ruleUpper");
const ruleSymbol = document.getElementById("ruleSymbol");
const ruleNumber = document.getElementById("ruleNumber");

const continueBtn = form.querySelector(".continue-btn");
const formStatus = document.getElementById("formStatus");

function showStatus(message, type) {
  formStatus.hidden = false;
  formStatus.className = `form-status ${type}`;
  formStatus.textContent = message;
}

function clearStatus() {
  formStatus.hidden = true;
  formStatus.className = "form-status";
  formStatus.textContent = "";
}

clinicName.addEventListener("input", () => {
  clinicName.value = clinicName.value.replace(/[^a-zA-Z\s]/g, "");
});

phone.addEventListener("input", () => {
  phone.value = phone.value.replace(/[^0-9]/g, "");
});

function toggleVisibility(input, button) {
  const icon = button.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    if (icon) {
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  } else {
    input.type = "password";
    if (icon) {
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    }
  }
}

togglePassword.addEventListener("mousedown", (e) => e.preventDefault());
toggleConfirm.addEventListener("mousedown", (e) => e.preventDefault());

togglePassword.addEventListener("click", () => {
  toggleVisibility(password, togglePassword);
});

toggleConfirm.addEventListener("click", () => {
  toggleVisibility(confirmPassword, toggleConfirm);
});

password.addEventListener("input", updateStrength);

function updateRule(element, valid) {
  element.classList.toggle("valid", valid);
}

function updateStrength() {
  const value = password.value;

  const hasLength = value.length >= 8;
  const hasUpper = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);

  updateRule(ruleLength, hasLength);
  updateRule(ruleUpper, hasUpper);
  updateRule(ruleNumber, hasNumber);
  updateRule(ruleSymbol, hasSymbol);

  let score = 0;

  if (hasLength) score++;
  if (hasUpper) score++;
  if (hasNumber) score++;
  if (hasSymbol) score++;

  switch (score) {
    case 0:
    case 1:
      strengthText.textContent = "Weak";
      strengthText.style.color = "#dc2626";
      strengthFill.style.width = "25%";
      strengthFill.style.background = "#dc2626";
      break;

    case 2:
      strengthText.textContent = "Fair";
      strengthText.style.color = "#f59e0b";
      strengthFill.style.width = "50%";
      strengthFill.style.background = "#f59e0b";
      break;

    case 3:
      strengthText.textContent = "Good";
      strengthText.style.color = "#2563eb";
      strengthFill.style.width = "75%";
      strengthFill.style.background = "#2563eb";
      break;

    case 4:
      strengthText.textContent = "Strong";
      strengthText.style.color = "#16a34a";
      strengthFill.style.width = "100%";
      strengthFill.style.background = "#16a34a";
      break;
  }
}

function getErrorMessage(data, fallback) {
  if (!data) return fallback;

  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  if (Array.isArray(data.errors) && data.errors.length) {
    return data.errors
      .map((item) => (typeof item === "string" ? item : item.message || JSON.stringify(item)))
      .join("\n");
  }

  return fallback;
}

function setLoading(isLoading) {
  continueBtn.disabled = isLoading;
  continueBtn.textContent = isLoading ? "Please wait..." : "Continue";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearStatus();

  const clinicNameValue = clinicName.value.trim();
  const emailValue = email.value.trim();
  const addressValue = state.value.trim();
  const passwordValue = password.value.trim();
  const confirmValue = confirmPassword.value.trim();

  const hasLength = passwordValue.length >= 8;
  const hasUpper = /[A-Z]/.test(passwordValue);
  const hasLower = /[a-z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);
  const hasSymbol = /[^A-Za-z0-9]/.test(passwordValue);

  if (!hasLength || !hasUpper || !hasLower || !hasNumber || !hasSymbol) {
    showStatus(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
      "error"
    );
    password.focus();
    return;
  }

  if (passwordValue !== confirmValue) {
    showStatus("Passwords do not match.", "error");
    confirmPassword.focus();
    return;
  }

  if (!addressValue) {
    showStatus("Please select a state.", "error");
    state.focus();
    return;
  }

  const payload = {
    clinicName: clinicNameValue,
    address: addressValue,
    email: emailValue,
    password: passwordValue,
  };

  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/clinic/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      showStatus(getErrorMessage(data, "Signup failed. Please try again."), "error");
      setLoading(false);
      return;
    }

    const result = data?.data || data;

    if (result?.token) {
      localStorage.setItem("authToken", result.token);
    }

    if (result?.clinic?.id) {
      localStorage.setItem("clinicId", result.clinic.id);
    }

    localStorage.setItem("signupEmail", emailValue);
    localStorage.setItem("clinicName", clinicNameValue);

    showStatus("Account created successfully! Redirecting to login...", "success");
    continueBtn.disabled = true;
    continueBtn.textContent = "Success";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 2500);
  } catch (error) {
    console.error("Signup error:", error);
    showStatus("Unable to reach the server. Please check your connection and try again.", "error");
    setLoading(false);
  }
});
