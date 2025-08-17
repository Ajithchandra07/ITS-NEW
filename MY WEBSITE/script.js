(function() {
  const data = window.AgriData;

  function setCurrentYear() {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  // CROPS
  function renderCrops(segmentKey) {
    const grid = document.getElementById('cropCards');
    if (!grid) return;
    grid.innerHTML = '';
    const crops = data.crops[segmentKey] || [];
    for (const c of crops) {
      const card = document.createElement('div');
      card.className = 'card media-top';
      card.innerHTML = `
        <img src="${c.image}" alt="${c.name}">
        <div class="card-body">
          <div class="title-row">
            <h3>${c.name}</h3>
            <span class="badge">${c.duration}</span>
          </div>
          <div class="kv">
            <div class="item"><div class="label">Soil</div><div class="value">${c.soil}</div></div>
            <div class="item"><div class="label">Weather</div><div class="value">${c.weather}</div></div>
            <div class="item"><div class="label">Investment/acre</div><div class="value">${c.investmentPerAcre}</div></div>
            <div class="item"><div class="label">Revenue/acre</div><div class="value">${c.revenuePerAcre}</div></div>
          </div>
        </div>
      `;
      grid.appendChild(card);
    }
  }

  function setupSegmented() {
    const buttons = Array.from(document.querySelectorAll('.seg-btn'));
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCrops(btn.dataset.seg);
      });
    });
  }

  // STATES
  function renderStatesSelect() {
    const select = document.getElementById('stateSelect');
    if (!select) return;
    select.innerHTML = '';
    const names = data.states.map(s => s.name).sort((a, b) => a.localeCompare(b));
    for (const name of names) {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    }
    const defaultIdx = names.indexOf('West Bengal');
    if (defaultIdx >= 0) select.selectedIndex = defaultIdx;
    renderStateDetails(select.value);
    select.addEventListener('change', () => renderStateDetails(select.value));
  }

  function renderStateDetails(stateName) {
    const container = document.getElementById('stateDetails');
    if (!container) return;
    container.innerHTML = '';
    const state = data.states.find(s => s.name === stateName) || data.states[0];
    if (!state) return;

    const card = document.createElement('div');
    card.className = 'state-card';
    card.innerHTML = `
      <h3>${state.name}</h3>
      <div class="state-meta">
        <div class="item"><div class="label">Soil</div><div class="value">${state.soil}</div></div>
        <div class="item"><div class="label">Weather</div><div class="value">${state.weather}</div></div>
        <div class="item"><div class="label">Investment/acre</div><div class="value">${state.investmentPerAcre}</div></div>
        <div class="item"><div class="label">Revenue/acre</div><div class="value">${state.revenuePerAcre}</div></div>
      </div>
      <div class="item"><div class="label">Major Crops</div><div class="value">${state.majorCrops.join(', ')}</div></div>
    `;

    container.appendChild(card);
  }

  function setupStateSearch() {
    const search = document.getElementById('stateSearch');
    const select = document.getElementById('stateSelect');
    if (!search || !select) return;
    search.addEventListener('input', () => {
      const q = search.value.toLowerCase().trim();
      const options = Array.from(select.options);
      const match = options.find(o => o.value.toLowerCase().includes(q));
      if (match) {
        select.value = match.value;
        renderStateDetails(select.value);
      }
    });
  }

  // UNITS
  function renderUnits() {
    const grid = document.getElementById('unitCards');
    if (!grid) return;
    grid.innerHTML = '';
    for (const u of data.units) {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-body">
          <div class="title-row">
            <h3>${u.name}</h3>
            <span class="badge">Long-term</span>
          </div>
          <div class="kv">
            <div class="item"><div class="label">Investment</div><div class="value">${u.investmentRange}</div></div>
            <div class="item"><div class="label">Revenue Potential</div><div class="value">${u.revenuePotential}</div></div>
            <div class="item" style="grid-column: span 2"><div class="label">Subsidies Available</div><div class="value">${u.subsidies.join('; ')}</div></div>
          </div>
        </div>
      `;
      grid.appendChild(card);
    }
  }

  // SCHEMES ACCORDION
  function renderSchemesAccordion() {
    const acc = document.getElementById('schemesAccordion');
    if (!acc) return;
    acc.innerHTML = '';
    const groups = [
      { key: 'Agriculture', label: 'Agriculture' },
      { key: 'Dairy', label: 'Dairy' },
      { key: 'AgroUnits', label: 'Agro-Units' },
      { key: 'MSME', label: 'MSME Loans' },
      { key: 'HouseholdsRenewable', label: 'Households & Renewable' }
    ];

    for (const g of groups) {
      const groupEl = document.createElement('div');
      groupEl.className = 'acc-group';
      const header = document.createElement('button');
      header.className = 'acc-header';
      header.innerHTML = `<span>${g.label}</span><span>+</span>`;
      const content = document.createElement('div');
      content.className = 'acc-content';

      const items = data.schemes[g.key] || [];
      for (const sc of items) {
        const scEl = document.createElement('div');
        scEl.className = 'scheme-card';
        scEl.innerHTML = `
          <h4>${sc.title}</h4>
          <div class="scheme-grid">
            <div><div class="label">Eligibility</div><div class="value">${sc.eligibility}</div></div>
            <div><div class="label">Benefit</div><div class="value">${sc.benefit}</div></div>
            <div><div class="label">Docs</div><div class="value">${Array.isArray(sc.documents) ? sc.documents.join(', ') : sc.documents}</div></div>
            <div><div class="label">Interest/Repayment</div><div class="value">${sc.interestRepayment || 'N/A'}</div></div>
            <div style="grid-column: span 2"><div class="label">Authority</div><div class="value">${sc.authority}</div></div>
          </div>
        `;
        content.appendChild(scEl);
      }

      header.addEventListener('click', () => {
        const open = content.classList.toggle('open');
        header.lastElementChild.textContent = open ? '−' : '+';
      });

      groupEl.appendChild(header);
      groupEl.appendChild(content);
      acc.appendChild(groupEl);
    }
  }

  function init() {
    setCurrentYear();
    setupSegmented();
    renderCrops('shortTerm');
    renderStatesSelect();
    setupStateSearch();
    renderUnits();
    renderSchemesAccordion();
  }

  document.addEventListener('DOMContentLoaded', init);
})();