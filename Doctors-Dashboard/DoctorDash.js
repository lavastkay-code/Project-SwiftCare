/* =========================================================
   DoctorDash.js
   All interactive behaviour for the "Reception Dashboard" page.
   Sidebar markup/content is untouched — only wired up here.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initSidebarSubmenus();
  initMobileSidebar();
  initPatientPopup();
  initQueueTable();
  initFilterDropdown();
  initNotifications();
  initUserMenu();
  initPagination();
});

/* ---------------------------------------------------------
   TOAST — small reusable feedback message
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
   SIDEBAR — submenu expand/collapse (unchanged behaviour,
   just relocated out of the inline <script>). All submenus
   start closed and only open when their own toggle is clicked.
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
   MOBILE SIDEBAR — the hamburger opens the entire sidebar as
   a slide-in drawer (backdrop + close button + escape key +
   auto-close on link tap), matching the Consultation Queue page.
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

/* 
   PATIENT MANAGEMENT POPUP (unchanged behaviour, relocated)
 */
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

/* 
   QUEUE TABLE — the welcome-row search bar and the queue
   panel's own search box both search the same table, so they
   stay in sync. Status filter, date filter, row actions and
   the "..." row menu all live here too since they share state.
 */
function initQueueTable() {
  const table = document.querySelector('.queue-table');
  if (!table) return;

  const topSearchInput = document.querySelector('.search-bar input');
  const panelSearchInput = document.querySelector('.queue-search input');
  const showingText = document.querySelector('.showing-text');

  const state = { search: '', status: 'all' };
  let entries = [];

  function patientLabel(entry) {
    if (entry.patient) return `${entry.patient.firstName || ''} ${entry.patient.lastName || ''}`.trim() || entry.patientId;
    return entry.patientId || 'Patient';
  }

  function rowMatchesFilters(entry) {
    const name = patientLabel(entry).toLowerCase();
    const id = (entry.patientId || '').toLowerCase();
    const term = state.search;
    const matchesSearch = !term || name.includes(term) || id.includes(term);

    const rowStatus = entry.status === 'In Consultation' ? 'progress' : 'waiting';
    const matchesStatus = state.status === 'all' || rowStatus === state.status;

    return matchesSearch && matchesStatus;
  }

  function renderRows() {
    const visible = entries.filter(rowMatchesFilters);

    table.querySelectorAll('.queue-row:not(.queue-head-row)').forEach((r) => r.remove());

    if (visible.length === 0) {
      const emptyRow = document.createElement('div');
      emptyRow.className = 'queue-row no-results-row';
      emptyRow.innerHTML = '<span class="no-results-text">No patients waiting for consultation.</span>';
      table.appendChild(emptyRow);
    } else {
      visible.forEach((entry, index) => {
        const queueId = entry.queueId || entry.id;
        const inConsultation = entry.status === 'In Consultation';
        const row = document.createElement('div');
        row.className = 'queue-row';
        row.dataset.queueId = queueId;
        row.dataset.patientId = entry.patientId;
        row.dataset.status = inConsultation ? 'progress' : 'waiting';
        row.innerHTML = `
          <span class="col-num">${index + 1}</span>
          <span class="col-patient">
            <span class="patient-name-block">
              <span class="patient-name">${patientLabel(entry)}</span>
              <span class="patient-id">${entry.patientId || '—'}</span>
            </span>
          </span>
          <span class="col-age"></span>
          <span class="col-time"></span>
          <span class="col-reason"></span>
          <span class="col-status"><span class="status-pill ${inConsultation ? 'status-progress' : 'status-waiting'}">${entry.status}</span></span>
          <span class="col-action"><button type="button" class="action-btn ${inConsultation ? 'btn-outline-blue' : 'btn-solid-green'}">${inConsultation ? 'Continue' : 'Start Consultation'}</button></span>
          <span class="col-menu"></span>
        `;
        table.appendChild(row);
      });
    }

    if (showingText) {
      showingText.textContent = `Showing ${visible.length} of ${entries.length} patients`;
    }
  }

  async function loadQueue() {
    try {
      const result = await swiftcareApiRequest('/queue');
      entries = (result.queue || []).filter(
        (e) => e.status === 'Awaiting Doctor' || e.status === 'In Consultation'
      );
      renderRows();
    } catch (err) {
      console.error('Failed to load consultation queue:', err);
      showToast(err.message || 'Failed to load queue.');
    }
  }

  function handleSearchInput(sourceInput, mirrorInput) {
    state.search = sourceInput.value.trim().toLowerCase();
    if (mirrorInput && mirrorInput.value !== sourceInput.value) {
      mirrorInput.value = sourceInput.value;
    }
    renderRows();
  }

  if (topSearchInput) {
    topSearchInput.addEventListener('input', () => handleSearchInput(topSearchInput, panelSearchInput));
  }
  if (panelSearchInput) {
    panelSearchInput.addEventListener('input', () => handleSearchInput(panelSearchInput, topSearchInput));
  }

  window.queueController = {
    setStatus(value) {
      state.status = value;
      renderRows();
    },
  };

  initActionButtons(table);
  loadQueue();
}


  //  ACTION BUTTONS — "Start Consultation" / "Continue"

  function initActionButtons(table) {
    table.addEventListener('click', async (e) => {
    const btn = e.target.closest('.action-btn');
    if (!btn) return;

    const row = btn.closest('.queue-row');
    if (!row) return;

    const queueId = row.dataset.queueId;
    const patientId = row.dataset.patientId;
    const name = row.querySelector('.patient-name')?.textContent || 'Patient';
    const startingFresh = btn.textContent.trim() === 'Start Consultation';

    btn.disabled = true;
    btn.textContent = startingFresh ? 'Starting...' : 'Loading...';

    try {
      let consultationId = null;

      if (startingFresh) {
        await swiftcareApiRequest(`/queue/${queueId}/status`, {
          method: 'POST',
          body: { status: 'In Consultation' },
        });
        const consultation = await swiftcareApiRequest('/consultations', {
          method: 'POST',
          body: { queueEntryId: queueId, patientId },
        });
        consultationId = consultation.id;
      } else {
        const existing = await swiftcareApiRequest(
          `/consultations/${patientId}?queueEntryId=${encodeURIComponent(queueId)}`
        );
        consultationId = existing?.id || existing?.consultation?.id;
      }

      sessionStorage.setItem('swiftcareActiveConsultation', JSON.stringify({
        queueId, patientId, consultationId, patientName: name,
      }));

      window.location.href = 'Consult.html';
    } catch (err) {
      console.error('Failed to start/resume consultation:', err);
      showToast(err.message || 'Failed to open consultation.');
      btn.disabled = false;
      btn.textContent = startingFresh ? 'Start Consultation' : 'Continue';
    }
  });
}

function initRowMenus(rows) {
  let menu = document.getElementById('rowActionMenu');
  if (!menu) {
    menu = document.createElement('div');
    menu.id = 'rowActionMenu';
    menu.className = 'row-menu';
    menu.innerHTML = `
      <button type="button" class="row-menu-item" data-action="view">
        <i class="fa-regular fa-eye"></i> View Patient Details
      </button>
      <button type="button" class="row-menu-item" data-action="reschedule">
        <i class="fa-regular fa-calendar"></i> Reschedule Appointment
      </button>
      <button type="button" class="row-menu-item danger" data-action="cancel">
        <i class="fa-regular fa-circle-xmark"></i> Cancel Appointment
      </button>
    `;
    document.body.appendChild(menu);
  }

  let activeRow = null;

  rows.forEach((row) => {
    const icon = row.querySelector('.col-menu');
    if (!icon) return;
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      activeRow = row;
      const rect = icon.getBoundingClientRect();
      menu.style.top = `${window.scrollY + rect.bottom + 6}px`;
      menu.style.left = `${window.scrollX + rect.right - menu.offsetWidth}px`;
      menu.classList.toggle('show', menu.dataset.forRow !== row.dataset.rowId || !menu.classList.contains('show'));
      menu.dataset.forRow = row.dataset.rowId || '';
    });
  });

  menu.addEventListener('click', (e) => {
    const item = e.target.closest('.row-menu-item');
    if (!item || !activeRow) return;
    const name = activeRow.querySelector('.patient-name')?.textContent || 'Patient';
    const action = item.dataset.action;

    if (action === 'view') {
      showToast(`Opening details for ${name}...`);
    } else if (action === 'reschedule') {
      showToast(`Reschedule flow for ${name} coming soon.`);
    } else if (action === 'cancel') {
      activeRow.style.opacity = '0.4';
      showToast(`Appointment cancelled for ${name}.`);
      setTimeout(() => {
        activeRow.remove();
      }, 300);
    }
    menu.classList.remove('show');
  });

  document.addEventListener('click', () => menu.classList.remove('show'));
  window.addEventListener('scroll', () => menu.classList.remove('show'), true);
}

/* ---------------------------------------------------------
   FILTER DROPDOWN — "All Status"
--------------------------------------------------------- */
function initFilterDropdown() {
  const dropdown = document.querySelector('.filter-dropdown');
  if (!dropdown) return;

  const trigger = dropdown.querySelector('.status-filter-btn');
  const panel = dropdown.querySelector('.filter-menu');
  if (!trigger || !panel) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('show');
  });

  panel.querySelectorAll('.filter-option').forEach((option) => {
    option.addEventListener('click', () => {
      panel.querySelectorAll('.filter-option').forEach((o) => o.classList.remove('active'));
      option.classList.add('active');

      const labelSpan = trigger.querySelector('.filter-label');
      if (labelSpan) labelSpan.textContent = option.textContent.trim();

      if (window.queueController) {
        window.queueController.setStatus(option.dataset.value);
      }
      panel.classList.remove('show');
    });
  });

  document.addEventListener('click', () => panel.classList.remove('show'));
}

/* ---------------------------------------------------------
   NOTIFICATIONS — bell dropdown + badge handling
--------------------------------------------------------- */
function initNotifications() {
  const wrapper = document.getElementById('bellWrapper');
  const panel = document.getElementById('notifPanel');
  const badge = document.getElementById('notifBadge');
  if (!wrapper || !panel) return;

  wrapper.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('show');
  });

  panel.addEventListener('click', (e) => {
    e.stopPropagation();
    const markAll = e.target.closest('[data-action="mark-all-read"]');
    const item = e.target.closest('.notif-item');

    if (markAll) {
      panel.querySelectorAll('.notif-item').forEach((n) => n.classList.add('read'));
      if (badge) badge.style.display = 'none';
      showToast('All notifications marked as read.');
    } else if (item) {
      item.classList.add('read');
      updateBadgeCount();
    }
  });

  function updateBadgeCount() {
    if (!badge) return;
    const unread = panel.querySelectorAll('.notif-item:not(.read)').length;
    if (unread === 0) {
      badge.style.display = 'none';
    } else {
      badge.textContent = unread;
    }
  }

  document.addEventListener('click', () => panel.classList.remove('show'));
}

/* ---------------------------------------------------------
   USER MENU — profile dropdown
--------------------------------------------------------- */
function initUserMenu() {
  const trigger = document.getElementById('userInfoBtn');
  const menu = document.getElementById('userMenu');
  if (!trigger || !menu) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('show');
  });

  menu.addEventListener('click', (e) => {
    const item = e.target.closest('.user-menu-item');
    if (!item) return;
    const action = item.dataset.action;
    if (action === 'logout') {
      showToast('Logging out...');
    } else if (action === 'profile') {
      showToast('Opening your profile...');
    } else if (action === 'settings') {
      showToast('Opening settings...');
    }
    menu.classList.remove('show');
  });

  document.addEventListener('click', () => menu.classList.remove('show'));
}

/* ---------------------------------------------------------
   PAGINATION — active page + prev/next state
   (Note: only page 1's rows exist in this markup, so this
   drives the UI state; wire page 2+ up to real data when
   that's available.)
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