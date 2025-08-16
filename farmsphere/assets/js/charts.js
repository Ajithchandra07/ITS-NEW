(function() {
  if (typeof Chart === 'undefined') return;

  const chartInstances = {};
  function destroyChart(id) {
    if (chartInstances[id]) {
      chartInstances[id].destroy();
      delete chartInstances[id];
    }
  }

  function createDoughnutChart(ctx, labels, data, colors) {
    return new Chart(ctx, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  }

  function createBarChart(ctx, labels, data, colors) {
    return new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderRadius: 6 }] },
      options: {
        responsive: true,
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: true }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  async function initHomeCharts() {
    const nationalEl = document.getElementById('nationalGdpChart');
    const agriVsDairyEl = document.getElementById('agriVsDairyChart');
    const topStatesAgriEl = document.getElementById('topStatesAgriChart');
    if (!nationalEl && !agriVsDairyEl && !topStatesAgriEl) return;

    try {
      const gdp = await window.FarmSphere.fetchJSON('/data/gdp.json');

      if (nationalEl) {
        destroyChart('nationalGdpChart');
        chartInstances['nationalGdpChart'] = createDoughnutChart(
          nationalEl.getContext('2d'),
          ['Agriculture', 'Dairy', 'Other Sectors'],
          [gdp.national.agriculturePercent, gdp.national.dairyPercent, 100 - gdp.national.agriculturePercent - gdp.national.dairyPercent],
          ['#10b981', '#34d399', '#e5e7eb']
        );
      }

      if (agriVsDairyEl) {
        destroyChart('agriVsDairyChart');
        chartInstances['agriVsDairyChart'] = createDoughnutChart(
          agriVsDairyEl.getContext('2d'),
          ['Agriculture', 'Dairy', 'Other'],
          [gdp.national.agriculturePercent, gdp.national.dairyPercent, 100 - gdp.national.agriculturePercent - gdp.national.dairyPercent],
          ['#10b981', '#34d399', '#cbd5e1']
        );
      }

      if (topStatesAgriEl) {
        const top = [...gdp.states]
          .sort((a, b) => b.agricultureGdpInCr - a.agricultureGdpInCr)
          .slice(0, 6);
        destroyChart('topStatesAgriChart');
        chartInstances['topStatesAgriChart'] = createBarChart(
          topStatesAgriEl.getContext('2d'),
          top.map(s => s.state),
          top.map(s => s.agricultureGdpInCr),
          top.map(() => '#10b981')
        );
      }
    } catch (err) {
      console.error('Failed to init homepage charts', err);
    }
  }

  document.addEventListener('DOMContentLoaded', initHomeCharts);

  // export helpers
  window.FarmSphere = window.FarmSphere || {};
  window.FarmSphere.destroyChart = destroyChart;
  window.FarmSphere.createBarChart = createBarChart;
  window.FarmSphere.createDoughnutChart = createDoughnutChart;
})();