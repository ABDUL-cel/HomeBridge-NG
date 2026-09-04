// This file runs after DOM is loaded
const user = JSON.parse(localStorage.getItem('hb_user'));
const token = localStorage.getItem('hb_token');
if (!user || !token) {
  window.location.href = '/';
}

// Set user info
document.getElementById('roleBadge').textContent = user.role;
document.getElementById('avatarPlaceholder').textContent = user.name[0].toUpperCase();

// Sidebar navigation
const navItems = document.getElementById('navItems');
if (user.role === 'LANDLORD') {
  navItems.innerHTML = `
    <a href="#" data-page="overview" class="sidebar-link active"><i class="fas fa-tachometer-alt"></i> Overview</a>
    <a href="#" data-page="properties" class="sidebar-link"><i class="fas fa-building"></i> My Properties</a>
    <a href="#" data-page="applications" class="sidebar-link"><i class="fas fa-file-signature"></i> Applications</a>
    <a href="#" data-page="talents" class="sidebar-link"><i class="fas fa-users"></i> Talents</a>
  `;
} else {
  navItems.innerHTML = `
    <a href="#" data-page="overview" class="sidebar-link active"><i class="fas fa-tachometer-alt"></i> Overview</a>
    <a href="#" data-page="properties" class="sidebar-link"><i class="fas fa-search"></i> Find Properties</a>
    <a href="#" data-page="applications" class="sidebar-link"><i class="fas fa-file-alt"></i> My Applications</a>
    <a href="#" data-page="profile" class="sidebar-link"><i class="fas fa-user"></i> My Profile</a>
  `;
}

// Mobile sidebar (duplicate)
document.getElementById('mobileSidebar').innerHTML = navItems.parentElement.innerHTML;
// Rebind click handlers
document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const page = this.dataset.page;
    navigateTo(page);
    // On mobile hide sidebar
    document.getElementById('mobileSidebar').classList.add('-translate-x-full');
    document.getElementById('mobileOverlay').classList.add('hidden');
    // Active styles
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

function toggleSidebar() {
  const sidebar = document.getElementById('mobileSidebar');
  const overlay = document.getElementById('mobileOverlay');
  sidebar.classList.toggle('-translate-x-full');
  overlay.classList.toggle('hidden');
}

async function navigateTo(page) {
  const title = document.getElementById('pageTitle');
  const content = document.getElementById('content');
  const role = user.role;

  // Loading state
  content.innerHTML = `<div class="space-y-4"><div class="skeleton skeleton-card"></div><div class="skeleton h-8"></div><div class="skeleton h-8"></div></div>`;

  switch (page) {
    case 'overview':
      title.textContent = 'Overview';
      content.innerHTML = await renderOverview(content, role);
      break;
    case 'properties':
      title.textContent = role === 'LANDLORD' ? 'My Properties' : 'Browse Properties';
      content.innerHTML = await renderProperties(content, role);
      break;
    case 'applications':
      title.textContent = role === 'LANDLORD' ? 'Received Applications' : 'My Applications';
      content.innerHTML = await renderApplications(content, role);
      break;
    case 'talents':
      title.textContent = 'Talent Directory';
      content.innerHTML = await renderTalents(content);
      break;
    case 'profile':
      title.textContent = 'My Profile';
      content.innerHTML = await renderProfile(content);
      break;
    default:
      content.innerHTML = '<p>Page not found</p>';
  }
}

// Load initial page
document.addEventListener('DOMContentLoaded', () => {
  // Sidebar click handlers exist above; navigate to overview by default
  const firstLink = document.querySelector('.sidebar-link');
  firstLink?.click();
});
