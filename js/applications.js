// js/applications.js
async function updateStatus(appId, newStatus) {
  // update UI immediately
  const row = document.querySelector(`[data-app-id="${appId}"]`);
  row.dataset.status = newStatus;
  row.querySelector('.status-badge').textContent = newStatus;

  try {
    await api(`/api/applications/${appId}`, { method: 'PUT', body: JSON.stringify({ status: newStatus }) });
    toast.show('Success!');
  } catch (err) {
    // rollback
    row.dataset.status = oldStatus;
    toast.show('Error, reverted');
  }
}
