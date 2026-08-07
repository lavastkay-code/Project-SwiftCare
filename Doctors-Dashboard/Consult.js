/* =========================================================
   index1.js
   All interactive behaviour for the "Consultation" page.
   Sidebar markup/content is untouched ÔÇö only wired up here.
   ========================================================= */

let activeConsultation = null;

document.addEventListener('DOMContentLoaded', function () {
  activeConsultation = loadActiveConsultation();
  initSidebarSubmenus();
  initMobileSidebar();
  initPatientPopup();
  initPatientDataLoad();
  initPreConsultationPanel();
  initAccordions();
  initHistoryEntries();
  initStatusPanelDate();
  initSaveAndComplete();
  initVitalPills();
  initUploadButtons();
  initPagination();
});

function loadActiveConsultation() {
  const raw = sessionStorage.getItem('swiftcareActiveConsultation');
  const visit = raw ? JSON.parse(raw) : null;

  if (!visit || !visit.consultationId) {
    alert('No active consultation. Please start one from the dashboard queue.');
    window.location.href = 'Doctordash.html';
    return null;
  }

  return visit;
}

/* ---------------------------------------------------------
   TOAST ÔÇö small reusable feedback message
--------------------------------------------------------- */
function showToast(message) {
  let toast = document.querySelector('.app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'app-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* ---------------------------------------------------------
   SIDEBAR ÔÇö submenu expand/collapse (unchanged behaviour,
   just relocated out of the inline <script>)
--------------------------------------------------------- */
function initSidebarSubmenus() {
  document.querySelectorAll('.nav-toggle').forEach((btn) => {
    const parentItem = btn.closest('.has-submenu');
    btn.addEventListener('click', () => {
      const isOpen = parentItem.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
    });
  });
}

/* ---------------------------------------------------------
   MOBILE SIDEBAR ÔÇö the hamburger opens the entire sidebar as
   a slide-in drawer (backdrop + close button + escape key +
   auto-close on link tap), matching the other SwiftCare pages.
--------------------------------------------------------- */
function initMobileSidebar() {
  const hamburger = document.getElementById('hamburgerBtn');
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const closeBtn = document.getElementById('sidebarCloseBtn');
  if (!hamburger || !sidebar) return;

  function openSidebar() {
    sidebar.classList.add('mobile-open');
    if (backdrop) backdrop.classList.add('show');
  }

  function closeSidebar() {
    sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('show');
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.contains('mobile-open') ? closeSidebar() : openSidebar();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSidebar();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeSidebar);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });

  sidebar.querySelectorAll('.nav-link:not(.nav-toggle), .submenu-link:not(.popup-trigger)').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 900px)').matches) closeSidebar();
    });
  });

  document.addEventListener('click', (e) => {
    if (
      sidebar.classList.contains('mobile-open') &&
      !sidebar.contains(e.target) &&
      e.target !== hamburger
    ) {
      closeSidebar();
    }
  });
}

/* ---------------------------------------------------------
   PATIENT MANAGEMENT POPUP (unchanged behaviour, relocated)
--------------------------------------------------------- */
function initPatientPopup() {
  const patientPopup = document.getElementById('patient-popup');
  const openPatientBtn = document.getElementById('openPatientPopup');
  const closePatientBtn = document.getElementById('closePatientPopup');
  if (!patientPopup || !openPatientBtn || !closePatientBtn) return;

  openPatientBtn.addEventListener('click', () => patientPopup.showModal());
  closePatientBtn.addEventListener('click', () => patientPopup.close());
  patientPopup.addEventListener('click', (e) => {
    if (e.target === patientPopup) patientPopup.close();
  });
}

/* ---------------------------------------------------------
   PATIENT DATA LOAD ÔÇö simulates fetching the patient record.
   Shows a loading overlay, then either the normal page or the
   "Unable to Load Patient Information" error state.

   Demo hooks:
   - Add ?fail=true to the URL to force the error state.
   - Otherwise there's a small random chance of failure, purely
     so the Retry / error pattern is easy to see without a
     real backend.
--------------------------------------------------------- */
function initPatientDataLoad() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  const mainView = document.getElementById('mainConsultationView');
  const errorState = document.getElementById('errorState');
  const retryBtn = document.getElementById('retryLoadBtn');
  if (!loadingOverlay || !mainView || !errorState) return;

  const forceFail = new URLSearchParams(window.location.search).get('fail') === 'true';

  function attemptLoad() {
    loadingOverlay.hidden = false;
    mainView.hidden = true;
    errorState.hidden = true;

    setTimeout(() => {
      const failed = forceFail || Math.random() < 0.15;
      loadingOverlay.hidden = true;
      if (failed) {
        errorState.hidden = false;
      } else {
        mainView.hidden = false;
      }
    }, 900);
  }

  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      showToast('Retrying...');
      attemptLoad();
    });
  }

  attemptLoad();
}

/* ---------------------------------------------------------
   PRE-CONSULTATION PANEL ÔÇö "View Patients profile" /
   "Start New Consultation" + billing summary, which gives way
   to the full consultation workspace once started.
--------------------------------------------------------- */
function initPreConsultationPanel() {
  const preConsultationPanel = document.getElementById('preConsultationPanel');
  const accordions = document.getElementById('consultationAccordions');
  const rightColumn = document.getElementById('consultationRight');
  const statusPanel = document.getElementById('statusPanel');
  const statusTag = document.getElementById('patientStatusTag');
  const viewProfileBtn = document.getElementById('viewProfileBtn');
  const startBtn = document.getElementById('startConsultationBtn');
  if (!preConsultationPanel || !startBtn) return;

  if (viewProfileBtn) {
    viewProfileBtn.addEventListener('click', () => {
      showToast('Opening patient profile...');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 300); // adjust delay (ms) as needed
    });
}

  startBtn.addEventListener('click', () => {
    preConsultationPanel.hidden = true;
    if (accordions) accordions.hidden = false;
    if (rightColumn) rightColumn.hidden = false;
    if (statusPanel) statusPanel.hidden = false;

    if (statusTag) {
      statusTag.classList.remove('status-tag-neutral');
      statusTag.classList.add('status-tag-active');
      statusTag.querySelector('.status-tag-text').textContent = 'currently in consultation';
    }

    showToast('Consultation started for Sarah Johnson.');
  });
}

function initAccordions() {
  document.querySelectorAll('.accordion-card').forEach((card) => {
    const toggle = card.querySelector('.accordion-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      card.classList.toggle('open');
    });
  });
}

function initHistoryEntries() {
  document.querySelectorAll('.history-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const entry = toggle.closest('.history-entry');
      const icon = toggle.querySelector('i');
      const isOpen = entry.classList.toggle('open');
      icon.classList.toggle('fa-chevron-down', isOpen);
      icon.classList.toggle('fa-chevron-right', !isOpen);
    });
  });
}

function initStatusPanelDate() {
  const dateView = document.getElementById('dateView');
  const dateInput = document.getElementById('consultDateInput');
  const dateMain = document.getElementById('dateMain');
  const dateDay = document.getElementById('dateDay');
  if (!dateView || !dateInput) return;

  function formatDate(value) {
    if (!value) return;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const main = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    if (dateMain) dateMain.textContent = main;
    if (dateDay) dateDay.textContent = weekday;
  }

  formatDate(dateInput.value);

  dateView.addEventListener('click', () => {
    if (typeof dateInput.showPicker === 'function') {
      dateInput.showPicker();
    } else {
      dateInput.click();
    }
  });

  dateInput.addEventListener('change', () => formatDate(dateInput.value));
}

function showStatusView(viewId) {
  document.querySelectorAll('.status-view').forEach((view) => {
    view.hidden = view.id !== viewId;
  });
}

/* ---------------------------------------------------------
   SAVE NOTE / COMPLETE CONSULTATION
--------------------------------------------------------- */
function initSaveAndComplete() {
  const saveBtn = document.getElementById('saveNoteBtn');
  const completeBtn = document.getElementById('completeConsultationBtn');
  const confirmYesBtn = document.getElementById('confirmYesBtn');
  const confirmCancelBtn = document.getElementById('confirmCancelBtn');
  const lastSavedText = document.getElementById('lastSavedText');
  const statusTag = document.getElementById('patientStatusTag');
  if (!saveBtn || !completeBtn) return;

  let revertTimer = null;

  function setSavedButtonState(isSaved) {
    saveBtn.classList.toggle('is-saved', isSaved);
    saveBtn.innerHTML = isSaved
      ? '<i class="fa-solid fa-check"></i> Saved'
      : 'Save Note';
  }

  saveBtn.addEventListener('click', () => {
    setSavedButtonState(true);
    showStatusView('savedView');
    if (lastSavedText) {
      lastSavedText.hidden = false;
      lastSavedText.querySelector('.last-saved-time').textContent = 'Just now';
    }

    clearTimeout(revertTimer);
    revertTimer = setTimeout(() => {
      setSavedButtonState(false);
      showStatusView('dateView');
      if (lastSavedText) lastSavedText.hidden = true;
    }, 3000);
  });

  completeBtn.addEventListener('click', () => {
    clearTimeout(revertTimer);
    showStatusView('confirmView');
  });

  if (confirmCancelBtn) {
    confirmCancelBtn.addEventListener('click', () => {
      showStatusView('dateView');
    });
  }

  if (confirmYesBtn) {
    confirmYesBtn.addEventListener('click', async () => {
      if (!activeConsultation) return;

      const diagnosis = document.getElementById('diagnosisInput')?.value.trim() || '';
      const notes = document.getElementById('notesInput')?.value.trim() || '';
      const prescriptionText = document.getElementById('prescriptionInput')?.value.trim() || '';

      const prescriptions = prescriptionText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [drugName, dosage, frequency, duration] = line.split(',').map((part) => part.trim());
          return {
            drugName: drugName || line,
            dosage: dosage || '',
            frequency: frequency || '',
            duration: duration || '',
          };
        });

      confirmYesBtn.disabled = true;
      confirmYesBtn.textContent = 'Completing...';

      try {
        await swiftcareApiRequest(`/consultations/${activeConsultation.consultationId}/complete`, {
          method: 'POST',
          body: { notes, diagnosis, prescriptions },
        });

        showStatusView('dateView');

        if (statusTag) {
          statusTag.classList.remove('status-tag-active');
          statusTag.classList.add('status-tag-neutral');
          statusTag.querySelector('.status-tag-text').textContent = 'Completed';
        }

        [saveBtn, completeBtn].forEach((btn) => (btn.disabled = true));
        document.querySelectorAll('.c-input, .c-textarea').forEach((field) => (field.disabled = true));

        sessionStorage.removeItem('swiftcareActiveConsultation');
        showToast('Consultation completed. Invoice created, patient sent to cashier.');
        setTimeout(() => {
          window.location.href = 'Doctordash.html';
        }, 1200);
      } catch (err) {
        console.error('Failed to complete consultation:', err);
        showToast(err.message || 'Failed to complete consultation.');
        confirmYesBtn.disabled = false;
        confirmYesBtn.textContent = 'Yes, Complete';
      }
    });
  }
}

/* ---------------------------------------------------------
   VITAL SIGN PILLS ÔÇö quick detail toast on click
--------------------------------------------------------- */
function initVitalPills() {
  document.querySelectorAll('.vital-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      const label = pill.querySelector('.vital-label')?.textContent || 'Vital sign';
      const value = pill.querySelector('.vital-value')?.textContent;
      showToast(value ? `${label}: ${value}` : `${label}: no reading recorded`);
    });
  });
}

/* ---------------------------------------------------------
   UPLOAD BUTTONS ÔÇö trigger a hidden file input and confirm
   the selection with a toast.
--------------------------------------------------------- */
function initUploadButtons() {
  document.querySelectorAll('.upload-btn').forEach((btn) => {
    const inputId = btn.dataset.fileTarget;
    const input = inputId ? document.getElementById(inputId) : null;
    if (!input) return;

    btn.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
      if (input.files && input.files.length > 0) {
        const label = btn.textContent.trim();
        showToast(`${label}: ${input.files[0].name} added.`);
      }
    });
  });
}

/* ---------------------------------------------------------
   PAGINATION ÔÇö active page + prev/next state
--------------------------------------------------------- */
function initPagination() {
  const pagination = document.querySelector('.pagination');
  if (!pagination) return;

  const pageButtons = Array.from(pagination.querySelectorAll('.page-btn'));
  const prevBtn = pagination.querySelector('.page-arrow:first-child');
  const nextBtn = pagination.querySelector('.page-arrow:last-child');

  function setActivePage(pageNum) {
    pageButtons.forEach((btn) => {
      btn.classList.toggle('active-page', Number(btn.textContent) === pageNum);
    });
    if (prevBtn) prevBtn.disabled = pageNum === 1;
    if (nextBtn) nextBtn.disabled = pageNum === pageButtons.length;
  }

  pageButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const pageNum = Number(btn.textContent);
      setActivePage(pageNum);
      showToast(`Loading page ${pageNum}...`);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const current = pageButtons.findIndex((b) => b.classList.contains('active-page')) + 1;
      if (current > 1) pageButtons[current - 2].click();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const current = pageButtons.findIndex((b) => b.classList.contains('active-page')) + 1;
      if (current < pageButtons.length) pageButtons[current].click();
    });
  }
}
