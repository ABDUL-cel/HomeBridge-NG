async function renderOverview(container, role) {
  if (role === 'LANDLORD') {
    const [properties, applications] = await Promise.all([api('/properties'), api('/applications')]);
    const myProps = properties.filter(p => p.landlordId._id === user.id);
    const pendingApps = applications.filter(a => a.status === 'PENDING');

    return `
      <div class="grid gap-6 grid-cols-1 md:grid-cols-3">
        <div class="bg-white p-6 rounded-lg shadow">
          <i class="fas fa-building text-3xl text-green-600"></i>
          <h3 class="text-2xl font-bold mt-2">${myProps.length}</h3>
          <p class="text-gray-500">Properties Listed</p>
          <a href="#" onclick="navigateTo('properties')" class="text-blue-600 text-sm">View all</a>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <i class="fas fa-file-signature text-3xl text-blue-600"></i>
          <h3 class="text-2xl font-bold mt-2">${applications.length}</h3>
          <p class="text-gray-500">Applications Received</p>
          <a href="#" onclick="navigateTo('applications')" class="text-blue-600 text-sm">View all</a>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <i class="fas fa-clock text-3xl text-yellow-500"></i>
          <h3 class="text-2xl font-bold mt-2">${pendingApps.length}</h3>
          <p class="text-gray-500">Pending Approvals</p>
        </div>
      </div>
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Recent Applications</h3>
        <p class="text-gray-500">No activity yet.</p>
      </div>
    `;
  } else {
    const [properties, applications] = await Promise.all([api('/properties'), api('/applications')]);
    return `
      <div class="grid gap-6 grid-cols-1 md:grid-cols-3">
        <div class="bg-white p-6 rounded-lg shadow">
          <i class="fas fa-home text-3xl text-green-600"></i>
          <h3 class="text-2xl font-bold mt-2">${properties.length}</h3>
          <p class="text-gray-500">Available Properties</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <i class="fas fa-check-circle text-3xl text-blue-600"></i>
          <h3 class="text-2xl font-bold mt-2">${applications.length}</h3>
          <p class="text-gray-500">My Applications</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <i class="fas fa-clock text-3xl text-yellow-500"></i>
          <h3 class="text-2xl font-bold mt-2">${applications.filter(a => a.status === 'PENDING').length}</h3>
          <p class="text-gray-500">Pending</p>
        </div>
      </div>
      <div class="mt-8">
        <h3 class="text-lg font-semibold mb-4">Recommended for you</h3>
        <div class="grid gap-6 grid-cols-1 md:grid-cols-2">
          ${properties.slice(0, 4).map(p => propertyCard(p, false)).join('')}
        </div>
      </div>
    `;
  }
}
