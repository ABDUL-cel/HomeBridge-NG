async function renderApplications(container, role) {
  const apps = await api('/applications');

  if (apps.length === 0) {
    return `
      <div class="empty-state">
        <i class="fas fa-inbox text-5xl text-gray-300"></i>
        <h3 class="text-2xl font-semibold text-gray-700">No applications</h3>
        <p class="text-gray-500">${role === 'LANDLORD' ? 'When talents apply to your properties, they will appear here.' : 'Apply to a property to track your request.'}</p>
      </div>
    `;
  }

  const rows = apps.map(app => {
    const property = app.propertyId;
    const talent = app.talentId;
    const statusColor = app.status === 'APPROVED' ? 'bg-green-100 text-green-700' : app.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700';

    return `
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200" data-app-id="${app._id}" data-status="${app.status}">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 class="font-semibold">${property.title}</h3>
            <p class="text-sm text-gray-500">${property.location}</p>
            ${role === 'LANDLORD' ? `<p class="text-sm mt-1"><strong>Applicant:</strong> ${talent ? talent.name : 'N/A'}</p>` : ''}
          </div>
          <div class="flex items-center gap-2">
            <span class="status-badge px-2 py-1 rounded text-xs font-semibold ${statusColor}">${app.status}</span>
            ${role === 'LANDLORD' && app.status === 'PENDING' ? `
              <button onclick="updateApplication('${app._id}', 'APPROVED')" class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Approve</button>
              <button onclick="updateApplication('${app._id}', 'REJECTED')" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Reject</button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `<div class="space-y-4">${rows}</div>`;
}

async function updateApplication(appId, newStatus) {
  // Optimistic UI
  const row = document.querySelector(`[data-app-id="${appId}"]`);
  const oldStatus = row.dataset.status;
  row.dataset.status = newStatus;
  row.querySelector('.status-badge').textContent = newStatus;

  try {
    await api(`/applications/${appId}`, { method: 'PUT', body: { status: newStatus } });
    showToast('Application ' + newStatus.toLowerCase());
  } catch (err) {
    // Rollback
    row.dataset.status = oldStatus;
    row.querySelector('.status-badge').textContent = oldStatus;
    showToast('Error: ' + err.message);
  }
}
