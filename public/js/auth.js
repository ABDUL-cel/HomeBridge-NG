
// Tabs
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const errorDiv = document.getElementById('error');

if (loginTab) {
  loginTab.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginTab.classList.remove('border-transparent', 'text-gray-400');
    loginTab.classList.add('border-green-500', 'text-green-600');
    registerTab.classList.add('border-transparent', 'text-gray-400');
    errorDiv.textContent = '';
  });

  registerTab.addEventListener('click', () => {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    registerTab.classList.remove('border-transparent', 'text-gray-400');
    registerTab.classList.add('border-green-500', 'text-green-600');
    loginTab.classList.add('border-transparent', 'text-gray-400');
    errorDiv.textContent = '';
  });
}

async function handleAuth(e, type) {
  e.preventDefault();
  errorDiv.textContent = '';
  const form = e.target;
  const body = Object.fromEntries(new FormData(form).entries());
  try {
    const data = await api(`/auth/${type}`, { method: 'POST', body });
    localStorage.setItem('hb_token', data.token);
    localStorage.setItem('hb_user', JSON.stringify(data.user));
    window.location.href = '/dashboard.html';
  } catch (err) {
    errorDiv.textContent = err.message;
  }
}

loginForm?.addEventListener('submit', (e) => handleAuth(e, 'login'));
registerForm?.addEventListener('submit', (e) => handleAuth(e, 'register'));
