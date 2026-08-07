document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial State Data (Can be updated via API/Websockets later)
  const queueData = {
    triage: 9,
    consultation: 8,
    payment: 6,
    priority: {
      high: 4,
      medium: 11,
      low: 8
    }
  };

  // Canvas elements & contexts
  const canvas = document.getElementById('donutChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Chart configuration
  const colors = {
    triage: '#3b82c4',       // Blue
    consultation: '#2fa85a', // Green
    payment: '#e8923c'       // Orange
  };

  // Render Interactive Donut Chart using HTML5 Canvas
   
  function drawDonutChart(data, activeCategory = null) {
    const total = data.triage + data.consultation + data.payment;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = 95;
    const innerRadius = 70;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (total === 0) return;

    // Slice segments configuration
    const segments = [
      { key: 'triage', value: data.triage, color: colors.triage },
      { key: 'consultation', value: data.consultation, color: colors.consultation },
      { key: 'payment', value: data.payment, color: colors.payment }
    ];

    let startAngle = -Math.PI / 2; // Start from top 12 o'clock position

    segments.forEach((seg) => {
      const sliceAngle = (seg.value / total) * (Math.PI * 2);
      const endAngle = startAngle + sliceAngle;

      // Pop-out animation effect for active hovered segment
      const isHovered = activeCategory === seg.key;
      const radiusOffset = isHovered ? 6 : 0;

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius + radiusOffset, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = seg.color;
      ctx.globalAlpha = (activeCategory && !isHovered) ? 0.4 : 1.0; // Dim unselected
      ctx.fill();

      startAngle = endAngle;
    });

    ctx.globalAlpha = 1.0; // Reset alpha
  }

  //Update Queue Values & Progress Bars across the DOM
   
  function updateDOMQueueMetrics(data) {
    const total = data.triage + data.consultation + data.payment;

    // Donut Center Text
    const donutNumber = document.querySelector('.donut-number');
    if (donutNumber) donutNumber.textContent = total;

    // Legend percentages & values
    const legendValues = document.querySelectorAll('.queue-legend .legend-value');
    if (legendValues.length >= 3) {
      const pTriage = Math.round((data.triage / total) * 100) || 0;
      const pConsult = Math.round((data.consultation / total) * 100) || 0;
      const pPay = Math.round((data.payment / total) * 100) || 0;

      legendValues[0].textContent = `${data.triage} (${pTriage}%)`;
      legendValues[1].textContent = `${data.consultation} (${pConsult}%)`;
      legendValues[2].textContent = `${data.payment} (${pPay}%)`;
    }

    // Priority Bars Track & Percentages
    const totalPriority = data.priority.high + data.priority.medium + data.priority.low;
    const priorityItems = document.querySelectorAll('.priority-item');

    if (priorityItems.length >= 3) {
      // High Priority
      priorityItems[0].querySelector('.priority-bar').style.width = `${(data.priority.high / totalPriority) * 100}%`;
      priorityItems[0].querySelector('.priority-value').textContent = data.priority.high;

      // Medium Priority
      priorityItems[1].querySelector('.priority-bar').style.width = `${(data.priority.medium / totalPriority) * 100}%`;
      priorityItems[1].querySelector('.priority-value').textContent = data.priority.medium;

      // Low Priority
      priorityItems[2].querySelector('.priority-bar').style.width = `${(data.priority.low / totalPriority) * 100}%`;
      priorityItems[2].querySelector('.priority-value').textContent = data.priority.low;
    }

    // Total Queue Card Bottom Box
    const totalQueueBoxVal = document.querySelector('.total-queue-box span:last-child');
    if (totalQueueBoxVal) totalQueueBoxVal.textContent = total;
  }

  // Add Interactive Hover / Focus Effects to Legend Items
   
  function setupLegendInteractivity() {
    const legendItems = document.querySelectorAll('.legend-item');
    const categories = ['triage', 'consultation', 'payment'];

    legendItems.forEach((item, index) => {
      item.style.cursor = 'pointer';
      item.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

      // Mouse Hover Enter
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateX(6px)';
        drawDonutChart(queueData, categories[index]);
      });

      // Mouse Hover Leave
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateX(0px)';
        drawDonutChart(queueData, null);
      });
    });
  }

  //Helper function to dynamically add/remove patients from queue
  window.updateQueueState = function(newTriage, newConsultation, newPayment) {
    queueData.triage = newTriage;
    queueData.consultation = newConsultation;
    queueData.payment = newPayment;

    updateDOMQueueMetrics(queueData);
    drawDonutChart(queueData);
  };

  // Initial Initialization
  drawDonutChart(queueData);
  updateDOMQueueMetrics(queueData);
  setupLegendInteractivity();
});
  // Mobile Hamburger Menu Toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sidebar = id = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  function toggleSidebar() {
    sidebar.classList.toggle('mobile-open');
    sidebarOverlay.classList.toggle('active');
  }

  hamburgerBtn.addEventListener('click', toggleSidebar);
  sidebarOverlay.addEventListener('click', toggleSidebar);

  // Submenu items expansion
  const toggleButtons = document.querySelectorAll('.nav-toggle');
  toggleButtons.forEach((btn) => {
    const parentItem = btn.closest('.has-submenu');

    btn.addEventListener('click', () => {
      const isOpen = parentItem.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
    });
  });

  // Patient Management popup logic
  const patientPopup = document.getElementById('patient-popup');
  const closePatientBtn = document.getElementById('closePatientPopup');

  document.querySelectorAll('.popup-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      // Close mobile sidebar if open before showing modal
      if (sidebar.classList.contains('mobile-open')) {
        toggleSidebar();
      }
      patientPopup.showModal();
    });
  });

  closePatientBtn.addEventListener('click', () => {
    patientPopup.close();
  });

  patientPopup.addEventListener('click', (e) => {
    if (e.target === patientPopup) {
      patientPopup.close();
    }
  });