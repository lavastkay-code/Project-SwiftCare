  /* ---------- Navigation Submenus ---------- */
      const toggleButtons = document.querySelectorAll('.nav-toggle');

      toggleButtons.forEach((btn) => {
        const parentItem = btn.closest('.has-submenu');

        btn.addEventListener('click', (e) => {
          if (e.target.closest('[data-nav]')) return;
          const isOpen = parentItem.classList.toggle('open');
          btn.setAttribute('aria-expanded', isOpen);
        });
      });

      document.querySelectorAll('[data-nav]').forEach((btn) => {
        btn.addEventListener('click', () => {
          window.location.href = btn.getAttribute('data-nav');
        });
      });

      /* ---------- Mobile sidebar toggle ---------- */
      const sidebar = document.querySelector('.sidebar');
      const hamburgerBtn = document.getElementById('hamburgerBtn');
      const sidebarOverlay = document.getElementById('sidebarOverlay');

      function openSidebar() {
        sidebar.classList.add('mobile-open');
        sidebarOverlay.classList.add('visible');
      }
      function closeSidebar() {
        sidebar.classList.remove('mobile-open');
        sidebarOverlay.classList.remove('visible');
      }

      if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
          if (sidebar.classList.contains('mobile-open')) {
            closeSidebar();
          } else {
            openSidebar();
          }
        });
      }
      if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
      }

      /* ---------- Search ---------- */
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') e.preventDefault();
        });
      }

      /* CHARGES LIST MODAL — scrollable through patient records, searchable by owner's name */
      const chargesData = [
        { patient: "Mr. John Deo", items: [
            { name: "Consultation Fee", desc: "Consultation + Pharmacy", dept: "General Medicine", amount: 20000 },
            { name: "Xray", desc: "Xray in device rendered", dept: "Radiology", amount: 10000 },
            { name: "Medication", desc: "Medication Pharmacy", dept: "Pharmacy", amount: 35000 },
            { name: "Lab Tests", desc: "Consultation + Lab Test", dept: "Laboratory", amount: 15000 },
        ]},
        { patient: "Mary Johnson", items: [
            { name: "Consultation Fee", desc: "General consultation", dept: "General Medicine", amount: 30000 },
            { name: "Blood Test", desc: "Full blood count", dept: "Laboratory", amount: 12000 },
            { name: "Medication", desc: "Prescribed pharmacy items", dept: "Pharmacy", amount: 38000 },
        ]},
        { patient: "Roberts Lee", items: [
            { name: "Consultation Fee", desc: "Neurology review", dept: "Neurology", amount: 25000 },
            { name: "MRI Scan", desc: "Brain MRI", dept: "Radiology", amount: 40000 },
        ]},
        { patient: "Mr. Okafor", items: [
            { name: "Consultation Fee", desc: "General consultation", dept: "General Medicine", amount: 10000 },
        ]},
        { patient: "Mr. Sam Okafor", items: [
            { name: "Pharmacy Items", desc: "Medication pickup", dept: "Pharmacy", amount: 10000 },
        ]},
        { patient: "Mr. Sam", items: [
            { name: "Pharmacy Items", desc: "Medication pickup", dept: "Pharmacy", amount: 25000 },
        ]},
      ];

      let chargesIndex = 0;

      const chargesPopup = document.getElementById('charges-popup');
      const closeChargesBtn = document.getElementById('closeChargesPopup');
      const chargesPatientName = document.getElementById('chargesPatientName');
      const chargesTableBody = document.getElementById('chargesTableBody');
      const chargesTotalAmount = document.getElementById('chargesTotalAmount');
      const chargesNavIndicator = document.getElementById('chargesNavIndicator');
      const chargesPrevBtn = document.getElementById('chargesPrevBtn');
      const chargesNextBtn = document.getElementById('chargesNextBtn');
      const chargesSearchInput = document.getElementById('chargesSearchInput');
      const chargesSearchBtn = document.getElementById('chargesSearchBtn');
      const chargesSearchError = document.getElementById('chargesSearchError');

      function formatNaira(n) {
        return '₦' + n.toLocaleString();
      }

      function renderCharges(index) {
        const record = chargesData[index];
        if (!record) return;

        chargesPatientName.textContent = `Charges List — ${record.patient}`;

        chargesTableBody.innerHTML = record.items.map(item => `
          <tr>
            <td class="item-name">${item.name}</td>
            <td>${item.desc}</td>
            <td>${item.dept}</td>
            <td>${formatNaira(item.amount)}</td>
          </tr>
        `).join('');

        const total = record.items.reduce((sum, i) => sum + i.amount, 0);
        chargesTotalAmount.textContent = formatNaira(total);

        chargesNavIndicator.textContent = `${index + 1} / ${chargesData.length}`;
        chargesPrevBtn.disabled = index === 0;
        chargesNextBtn.disabled = index === chargesData.length - 1;

        chargesSearchError.classList.remove('visible');
      }

      function openChargesModal(index = 0) {
        chargesIndex = index;
        renderCharges(chargesIndex);
        chargesSearchInput.value = '';
        chargesPopup.showModal();
      }

      /* Open from the sidebar "Review Charges" link -> first record */
      const openChargesLink = document.getElementById('openChargesPopup');
      if (openChargesLink) {
        openChargesLink.addEventListener('click', (e) => {
          e.preventDefault();
          openChargesModal(0);
        });
      }

      /* Prev / Next navigation through patient records */
      if (chargesPrevBtn) {
        chargesPrevBtn.addEventListener('click', () => {
          if (chargesIndex > 0) {
            chargesIndex--;
            renderCharges(chargesIndex);
          }
        });
      }

      if (chargesNextBtn) {
        chargesNextBtn.addEventListener('click', () => {
          if (chargesIndex < chargesData.length - 1) {
            chargesIndex++;
            renderCharges(chargesIndex);
          }
        });
      }

      /* Search by owner's name */
      function runChargesSearch() {
        const query = chargesSearchInput.value.trim().toLowerCase();
        if (!query) return;

        const foundIndex = chargesData.findIndex(r => r.patient.toLowerCase().includes(query));

        if (foundIndex === -1) {
          chargesSearchError.classList.add('visible');
          return;
        }

        chargesIndex = foundIndex;
        renderCharges(chargesIndex);
      }

      if (chargesSearchBtn) {
        chargesSearchBtn.addEventListener('click', runChargesSearch);
      }
      if (chargesSearchInput) {
        chargesSearchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            runChargesSearch();
          }
        });
      }

      if (closeChargesBtn) {
        closeChargesBtn.addEventListener('click', () => {
          chargesPopup.close();
        });
      }

      if (chargesPopup) {
        chargesPopup.addEventListener('click', (e) => {
          if (e.target === chargesPopup) {
            chargesPopup.close();
          }
        });
      }

      /* INTERACTIVE PAYMENT METHOD / RECEIPT MODAL LOGIC */
      const paymentPopup = document.getElementById('payment-popup');
      const closePaymentBtn = document.getElementById('closePaymentPopup');
      const tabBtns = document.querySelectorAll('.tab-btn');
      const paymentOptions = document.querySelectorAll('.payment-option');
      const modalPaymentAmount = document.getElementById('modalPaymentAmount');
      const btnSubmitPayment = document.getElementById('btnSubmitPayment');
      const paymentModalContent = document.getElementById('payment-modal-content');
      const paymentSuccessMsg = document.getElementById('paymentSuccessMsg');
      const successDetailText = document.getElementById('successDetailText');
      const btnDoneClose = document.getElementById('btnDoneClose');

      let selectedMethod = 'cash';
      let selectedMethodName = 'Cash Payment';
      let currentAmountStr = '₦1900.00';

      // Open modal dynamically when clicking ANY print button in the table
      document.querySelectorAll('.transactions-table .action-print').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const row = e.target.closest('tr');
          if (row) {
            const rowAmount = row.children[3]?.textContent.trim();
            if (rowAmount) {
              currentAmountStr = rowAmount;
              modalPaymentAmount.textContent = currentAmountStr;
            }
          }
          // Reset view state
          paymentModalContent.style.display = 'block';
          paymentSuccessMsg.style.display = 'none';
          paymentPopup.showModal();
        });
      });

      // Synchronize selection state (Tabs & Radio Options)
      function setPaymentMethod(methodKey) {
        selectedMethod = methodKey;

        // Update Top Tabs
        tabBtns.forEach((tab) => {
          if (tab.dataset.method === methodKey) {
            tab.classList.add('active');
            selectedMethodName = tab.textContent.trim();
          } else {
            tab.classList.remove('active');
          }
        });

        // Update Radio Cards
        paymentOptions.forEach((opt) => {
          if (opt.dataset.method === methodKey) {
            opt.classList.add('selected');
          } else {
            opt.classList.remove('selected');
          }
        });
      }

      // Event Listeners for Pill Tabs
      tabBtns.forEach((tab) => {
        tab.addEventListener('click', () => {
          setPaymentMethod(tab.dataset.method);
        });
      });

      // Event Listeners for Radio Card Rows
      paymentOptions.forEach((opt) => {
        opt.addEventListener('click', () => {
          setPaymentMethod(opt.dataset.method);
        });
      });

      // Submit Payment Action Simulation
      if (btnSubmitPayment) {
        btnSubmitPayment.addEventListener('click', () => {
          successDetailText.textContent = `Transaction of ${currentAmountStr} processed successfully via ${selectedMethodName}.`;
          paymentModalContent.style.display = 'none';
          paymentSuccessMsg.style.display = 'block';
        });
      }

      // Additional Action Buttons Visual Feedback
      document.getElementById('btnPrintReceipt')?.addEventListener('click', () => {
        alert(`Printing Thermal Receipt for ${currentAmountStr}...`);
      });

      document.getElementById('btnSendDigital')?.addEventListener('click', () => {
        alert(`SMS & Email Receipt dispatched successfully!`);
      });

      document.getElementById('btnProcessGate')?.addEventListener('click', () => {
        alert(`Payment processed and Cash Gate cleared.`);
      });

      // Close Dialog Controls
      if (btnDoneClose) {
        btnDoneClose.addEventListener('click', () => {
          paymentPopup.close();
        });
      }

      if (closePaymentBtn) {
        closePaymentBtn.addEventListener('click', () => {
          paymentPopup.close();
        });
      }

      if (paymentPopup) {
        paymentPopup.addEventListener('click', (e) => {
          if (e.target === paymentPopup) {
            paymentPopup.close();
          }
        });
      }

      /* ---------- Patient Popup ---------- */
      const patientPopup = document.getElementById('patient-popup');
      const openPatientBtn = document.getElementById('openPatientPopup');
      const closePatientBtn = document.getElementById('closePatientPopup');

      if (openPatientBtn && patientPopup) {
        openPatientBtn.addEventListener('click', () => {
          patientPopup.showModal();
        });
      }

      if (closePatientBtn && patientPopup) {
        closePatientBtn.addEventListener('click', () => {
          patientPopup.close();
        });
      }

      if (patientPopup) {
        patientPopup.addEventListener('click', (e) => {
          if (e.target === patientPopup) {
            patientPopup.close();
          }
        });
      }