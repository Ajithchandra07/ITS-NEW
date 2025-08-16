(function() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  function setActiveNav() {
    const links = document.querySelectorAll('header nav a[href]');
    links.forEach(link => {
      try {
        const url = new URL(link.href, window.location.origin);
        if (url.pathname === window.location.pathname) {
          link.classList.add('text-primary-700', 'font-medium');
        }
      } catch (_) {}
    });
  }
  setActiveNav();

  // Role persistence (farmer, policymaker, researcher)
  window.FarmSphere = window.FarmSphere || {};
  window.FarmSphere.saveRole = function(role) {
    localStorage.setItem('fs_role', role);
  };
  window.FarmSphere.getRole = function() {
    return localStorage.getItem('fs_role') || 'guest';
  };

  // JSON loader with cache busting in dev
  window.FarmSphere.fetchJSON = async function(path) {
    const url = `${path}${path.includes('?') ? '&' : '?'}v=${Date.now()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.json();
  };

  // Simple helpers
  window.FarmSphere.formatNumber = function(num) {
    try { return new Intl.NumberFormat('en-IN').format(num); } catch (_) { return `${num}`; }
  };
})();