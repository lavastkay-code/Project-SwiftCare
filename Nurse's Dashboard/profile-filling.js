document.addEventListener('DOMContentLoaded', () => {
  initializeSidebar();
  initializeHamburger();
  initializeDates();
  initializeBackButton();
  initializeTabs();
  initializeCharacterCounter();
  initializeVitalsForm();
  initializeStartTriageButton();
  initializePopup();
  initializeKeyboardShortcuts();
});


function initializeSidebar() {
  const toggles = document.querySelectorAll('.nav-toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const parent = toggle.closest('.has-submenu');

      // Toggle current submenu
      parent.classList.toggle('open');
    });
  });
}

function initializeHamburger() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobileOverlay');

  if (!hamburgerBtn || !sidebar) return;

  hamburgerBtn.addEventListener('click', () => {

    if (window.innerWidth > 900) {
      sidebar.classList.toggle('collapsed');
      return;
    }

    sidebar.classList.toggle('open');

    if (overlay) {
      overlay.classList.toggle('show');
    }
  });


  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      sidebar.classList.remove('open');

      if (overlay) {
        overlay.classList.remove('show');
      }
    }
  });
}


function initializeDates() {
  const sidebarDate = document.getElementById('sidebarDate');
  const appointmentTime = document.getElementById('appointmentTime');

  const now = new Date();

  if (sidebarDate) {
    sidebarDate.textContent = now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  if (appointmentTime) {
    const appointment = new Date();

    appointment.setHours(10, 30, 0, 0);

    appointmentTime.textContent =
      appointment.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) +
      ' ' +
      appointment.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      });
  }
}


function initializeBackButton() {
  const backBtn = document.querySelector('.back-btn');

  backBtn?.addEventListener('click', () => {
    showToast('Returning to Triage Queue...', 'info');

    // Example:
    // window.location.href = 'triage-queue.html';
  });
}


function initializeTabs() {
  const tabs = document.querySelectorAll('.tab-btn');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(btn => btn.classList.remove('active'));
      tab.classList.add('active');

      const tabName = tab.textContent.trim();

      if (tabName !== 'Vitals') {
        showToast(`${tabName} section will be available soon.`, 'info');
      }
    });
  });
}


function initializeCharacterCounter() {
  const notesInput = document.getElementById('notesInput');
  const notesCount = document.getElementById('notesCount');

  if (!notesInput || !notesCount) return;

  const updateCounter = () => {
    notesCount.textContent = notesInput.value.length;
  };

  notesInput.addEventListener('input', updateCounter);

  updateCounter();
}


/* UPDATED FUNCTION: Redirects to target page on click */
function initializeStartTriageButton() {
  const triageBtn = document.getElementById('startTriageBtn');
  const statusBadge = document.getElementById('queueStatusBadge');

  if (!triageBtn) return;

  triageBtn.addEventListener('click', () => {
    triageBtn.disabled = true;
    triageBtn.textContent = 'Starting Triage...';

    if (statusBadge) {
      statusBadge.textContent = 'Triage In Progress';
    }

    showToast('Redirecting to triage workspace...', 'info');

    setTimeout(() => {
      window.location.href = 'profile-popup.html';
    }, 500);
  });
}


function initializeVitalsForm() {
  const form = document.getElementById('recordVitalsForm');
  const clearBtn = document.getElementById('clearFormBtn');

  if (!form) return;


  clearBtn?.addEventListener('click', () => {
    form.reset();

    const notesCount = document.getElementById('notesCount');
    if (notesCount) {
      notesCount.textContent = '0';
    }

    clearValidation(form);

    showToast('Form cleared.', 'info');
  });


  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const bp = document.getElementById('bpInput').value.trim();
    const temp = document.getElementById('tempInput').value.trim();
    const weight = document.getElementById('weightInput').value.trim();
    const pulse = document.getElementById('pulseInput').value.trim();
    const notes = document.getElementById('notesInput').value.trim();

    let isValid = true;

    clearValidation(form);

    if (!validateBloodPressure(bp)) {
      showFieldError('bpInput', 'Enter BP like 120/80');
      isValid = false;
    }

    if (!validateTemperature(temp)) {
      showFieldError('tempInput', 'Temperature must be between 30°C and 45°C');
      isValid = false;
    }

    if (!validateWeight(weight)) {
      showFieldError('weightInput', 'Weight must be between 1kg and 500kg');
      isValid = false;
    }

    if (pulse && !validatePulse(pulse)) {
      showFieldError('pulseInput', 'Pulse must be between 20 and 250 bpm');
      isValid = false;
    }

    if (!isValid) {
      showToast('Please correct the highlighted fields.', 'error');
      return;
    }

    const saveBtn = document.getElementById('saveVitalsBtn');

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    setTimeout(() => {
      const vitalsData = {
        bp,
        temp,
        weight,
        pulse: pulse || 'Not recorded',
        notes,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('latestVitals', JSON.stringify(vitalsData));

      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Vitals';

      const overlay = document.getElementById('successOverlay');

      overlay?.classList.remove('hidden');

      document.body.style.overflow = 'hidden';

      showToast('Vitals recorded successfully!', 'success');

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = 'profile-popup.html';
      }, 2000);

    }, 1000);
  });
}


function validateBloodPressure(value) {
  return /^\d{2,3}\/\d{2,3}$/.test(value);
}

function validateTemperature(value) {
  const temp = parseFloat(value);
  return !isNaN(temp) && temp >= 30 && temp <= 45;
}

function validateWeight(value) {
  const weight = parseFloat(value);
  return !isNaN(weight) && weight > 0 && weight <= 500;
}

function validatePulse(value) {
  const pulse = parseInt(value, 10);
  return !isNaN(pulse) && pulse >= 20 && pulse <= 250;
}

function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);

  if (!input) return;

  input.style.borderColor = '#ef4444';
  input.style.boxShadow = '0 0 0 4px rgba(239,68,68,0.12)';

  // Remove existing error
  const existing = input.parentElement.querySelector('.field-error');
  if (existing) {
    existing.remove();
  }

  const error = document.createElement('small');
  error.className = 'field-error';
  error.textContent = message;
  error.style.color = '#ef4444';
  error.style.fontSize = '12px';

  input.parentElement.appendChild(error);
}

function clearValidation(form) {
  form.querySelectorAll('input, textarea').forEach(field => {
    field.style.borderColor = '';
    field.style.boxShadow = '';
  });

  form.querySelectorAll('.field-error').forEach(error => {
    error.remove();
  });
}

function initializePopup() {
  const overlay = document.getElementById('successOverlay');
  const continueBtn = document.getElementById('continueQueueBtn');

  if (!overlay) return;

  const closePopup = () => {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';

    const statusBadge = document.getElementById('queueStatusBadge');

    if (statusBadge) {
      statusBadge.textContent = 'Vitals Recorded';
    }

    showToast('Patient returned to queue successfully.', 'success');
  };

  continueBtn?.addEventListener('click', closePopup);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      closePopup();
    }
  });
}


function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    // ESC closes popup
    if (e.key === 'Escape') {
      const overlay = document.getElementById('successOverlay');

      if (overlay && !overlay.classList.contains('hidden')) {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();

      const form = document.getElementById('recordVitalsForm');

      if (form) {
        form.requestSubmit();
      }
    }
  });
}


function showToast(message, type = 'info') {
  // Remove existing toast
  const existing = document.querySelector('.toast-notification');
  if (existing) {
    existing.remove();
  }

  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;

  const icon = getToastIcon(type);

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  Object.assign(toast.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: '3000',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 18px',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
    transform: 'translateX(120%)',
    transition: 'transform 0.3s ease'
  });

  switch (type) {
    case 'success':
      toast.style.background = '#16a34a';
      break;

    case 'error':
      toast.style.background = '#dc2626';
      break;

    default:
      toast.style.background = '#2563eb';
  }

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

function getToastIcon(type) {
  switch (type) {
    case 'success':
      return 'fa-circle-check';

    case 'error':
      return 'fa-circle-exclamation';

    default:
      return 'fa-circle-info';
  }
}


document.addEventListener('click', e => {
  const button = e.target.closest('button');

  if (!button || button.disabled) return;

  button.style.transform = 'scale(0.98)';

  setTimeout(() => {
    button.style.transform = '';
  }, 120);
});

setInterval(() => {
  const waitTimeEl = document.getElementById('waitTime');

  if (!waitTimeEl) return;

  const current = parseInt(waitTimeEl.textContent);

  if (!isNaN(current) && current < 60) {
    waitTimeEl.textContent = `${current + 1} mins`;
  }
}, 60000);


window.addEventListener('load', () => {
  const saved = localStorage.getItem('latestVitals');

  if (saved) {
    try {
      const vitals = JSON.parse(saved);

      console.log('Last recorded vitals:', vitals);
    } catch (err) {
      console.error('Error loading saved vitals:', err);
    }
  }

  document.querySelectorAll('.card, .side-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';

    setTimeout(() => {
      card.style.transition =
        'opacity 0.35s ease, transform 0.35s ease';

      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 80);
  });
});