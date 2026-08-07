// Toggle Sidebar
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('open');
}

// Logout
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        alert("Logged out successfully!");
    }
}

// Update Date
function updateDate() {
    const dateEl = document.getElementById('current-date');
    if (!dateEl) return;

    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const formatted = now.toLocaleDateString('en-US', options);
    dateEl.textContent = formatted;
}

// Initialize
window.onload = function () {
    updateDate();
};