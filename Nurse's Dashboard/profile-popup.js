document.addEventListener('DOMContentLoaded', () => {
  initializeSidebar();
  initializeHamburger();
  initializeDates();
  initializeVitalsTimestamp();
  initializeEditVitals();
  initializeNextStagePopup();
  initializeTabs();
  initializeBackButton();
  initializeKeyboardShortcuts();
});

function initializeSidebar() {
  const toggles = document.querySelectorAll('.nav-toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const parent = toggle.closest('.has-submenu');
      const isOpen = parent.classList.contains('open');

      document.querySelectorAll('.has-submenu').forEach(item => {
        item.classList.remove('open');

        const btn = item.querySelector('.nav-toggle');
        if (btn) {
          btn.setAttribute('aria-expanded', 'false');
        }
      });

      if (!isOpen) {
        parent.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
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

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

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

  if (sidebarDate) {
    const now = new Date();

    sidebarDate.textContent = now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  const appointmentTime = document.getElementById('appointmentTime');

  if (appointmentTime) {
    const appointment = new Date();

    appointment.setDate(appointment.getDate());
    appointment.setHours(10, 30, 0, 0);

    appointmentTime.textContent = appointment.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ' ' + appointment.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  }
}

function initializeVitalsTimestamp() {
  const timestampEl = document.getElementById('vitalsTimestamp');

  if (!timestampEl) return;

  updateTimestamp(timestampEl);

  setInterval(() => {
    updateTimestamp(timestampEl);
  }, 60000);
}

function updateTimestamp(element) {
  const now = new Date();

  element.textContent = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) + ' ' + now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
}

function initializeEditVitals() {
  const editBtn = document.getElementById('editVitalsBtn');
  const editOverlay = document.getElementById('editOverlay');
  const closeBtn = document.getElementById('closeEditBtn');
  const cancelBtn = document.getElementById('cancelEditBtn');
  const form = document.getElementById('vitalsForm');

  if (!editBtn || !editOverlay || !form) return;


  editBtn.addEventListener('click', () => {
    editOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });

  const closeModal = () => {
    editOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);

  editOverlay.addEventListener('click', e => {
    if (e.target === editOverlay) {
      closeModal();
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const bp = document.getElementById('bpInput').value.trim();
    const temp = document.getElementById('tempInput').value.trim();
    const weight = document.getElementById('weightInput').value.trim();
    const pulse = document.getElementById('pulseInput').value.trim();
    const notes = document.getElementById('notesInput').value.trim();

    if (!bp || !temp || !weight || !pulse) {
      showTemporaryMessage('Please fill in all required fields.', 'error');
      return;
    }

    document.getElementById('bpValue').textContent = bp;
    document.getElementById('tempValue').textContent = temp;
    document.getElementById('weightValue').textContent = weight;
    document.getElementById('pulseValue').textContent = pulse;
    document.getElementById('notesValue').textContent = notes || 'No additional notes.';

    addVitalsToHistory(bp, temp, weight, pulse);

    const timestampEl = document.getElementById('vitalsTimestamp');
    if (timestampEl) {
      updateTimestamp(timestampEl);
    }

    closeModal();

    showTemporaryMessage('Vitals updated successfully!', 'success');
  });
}

function addVitalsToHistory(bp, temp, weight, pulse) {
  const tbody = document.getElementById('vitalsHistoryBody');

  if (!tbody) return;

  const now = new Date();

  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${now.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })}, ${now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })}</td>
    <td>${bp}</td>
    <td>${temp}</td>
    <td>${weight}</td>
    <td>${pulse}</td>
  `;

  tbody.insertBefore(row, tbody.firstChild);
}

function initializeNextStagePopup() {
  const nextStageBtn = document.getElementById('nextStageBtn');
  const successOverlay = document.getElementById('successOverlay');
  const backToQueueBtn = document.getElementById('backToQueueBtn');

  if (!nextStageBtn || !successOverlay) return;

  nextStageBtn.addEventListener('click', () => {
    nextStageBtn.disabled = true;
    nextStageBtn.textContent = 'Processing...';

    setTimeout(() => {
      successOverlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      nextStageBtn.disabled = false;
      nextStageBtn.textContent = 'Next Stage: Doctor Consultation';

      updateQueueStatus();
    }, 800);
  });

  const closePopup = () => {
    successOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  };
/* UPDATED: Redirects to nurseTriage.html on click */
  backToQueueBtn?.addEventListener('click', () => {
    closePopup();

    showTemporaryMessage('Redirecting to Nurse Triage queue...', 'success');

    // Redirect to nurseTriage.html after a brief delay
    setTimeout(() => {
      window.location.href = 'nurseTriage.html';
    }, 400);
  });

  successOverlay.addEventListener('click', e => {
    if (e.target === successOverlay) {
      closePopup();
    }
  });
}

function updateQueueStatus() {
  const statusBadges = document.querySelectorAll('.status-badge');

  statusBadges.forEach(badge => {
    badge.textContent = 'Doctor Consultation';
  });

  const waitTime = document.getElementById('waitTime');

  if (waitTime) {
    waitTime.textContent = '2 mins';
  }
}

function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const tabName = button.textContent.trim();

      if (tabName !== 'Vitals') {
        showTemporaryMessage(`${tabName} section will be available soon.`, 'info');
      }
    });
  });
}

function initializeBackButton() {
  const backBtn = document.querySelector('.back-btn');

  if (!backBtn) return;

  backBtn.addEventListener('click', () => {

    showTemporaryMessage('Returning to Triage Queue...', 'info');

    // In a real application:
    window.location.href = 'nurseTriage.html';
  });
}


function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    // ESC closes modals
    if (e.key === 'Escape') {
      const successOverlay = document.getElementById('successOverlay');
      const editOverlay = document.getElementById('editOverlay');

      if (successOverlay && !successOverlay.classList.contains('hidden')) {
        successOverlay.classList.add('hidden');
        document.body.style.overflow = '';
      }

      if (editOverlay && !editOverlay.classList.contains('hidden')) {
        editOverlay.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }

   
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
      e.preventDefault();

      const editBtn = document.getElementById('editVitalsBtn');
      editBtn?.click();
    }
  });
}

function showTemporaryMessage(message, type = 'info') {

  const existingToast = document.querySelector('.temp-toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = `temp-toast temp-toast-${type}`;

  const icon = getToastIcon(type);

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;


  Object.assign(toast.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: '2000',
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

function generatePatientId() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `SWC-${random}`;
}

function calculateWaitTime(checkInTime) {
  const now = new Date();
  const checkIn = new Date(checkInTime);

  const diffMinutes = Math.max(
    0,
    Math.floor((now - checkIn) / (1000 * 60))
  );

  return `${diffMinutes} mins`;
}


function simulateApiCall(data, delay = 800) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    }, delay);
  });
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

  if (waitTimeEl && waitTimeEl.textContent.includes('mins')) {
    const current = parseInt(waitTimeEl.textContent);

    if (!isNaN(current) && current < 60) {
      waitTimeEl.textContent = `${current + 1} mins`;
    }
  }
}, 60000);


window.addEventListener('load', () => {
  document.body.style.opacity = '1';

  const cards = document.querySelectorAll('.card, .side-card');

  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';

    setTimeout(() => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
});