const loginForm = document.getElementById("loginForm");

  const correctEmail = "admin@example.com";
  const correctPassword = "Admin123#";

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Email and Password are required.");
      return;
    }

    if (email === correctEmail && password === correctPassword) {
      window.location.href = "ADMIN-dashboard.html";
    } else {
      alert("Incorrect email or password.");
    }
  });
