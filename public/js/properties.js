async function renderProperties(container, role) {
  container.innerHTML = '';
  const properties = await api('/properties');

  // Empty state
  if (properties.length === 0) {
    return `
      <div class="empty-state">
        <i class="fas fa-home text-5xl text-gray-300"></i>
        <h3 class="text-2xl font-semibold text-gray-700">No properties yet</h3>
        ${role === 'LANDLORD' ? '<button class="bg-green-600 text-white px-4 py-2 rounded" onclick="openPropertyModal()">Add your first property</button>' : '<p>New listings coming soon!</p>'}
      </div>
    `;
  }

  // Landlord view: show own properties (with edit/delete)
  if (role === 'LANDLORD') {
    const myProps = properties.filter(p => p.landlordId._id === user.id);
    return `
      <div class="flex justify-end mb-4">
        <button onclick="openPropertyModal()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">
          <i class="fas fa-plus mr-1"></i> Add Property
        </button>
      </div>
      ${myProps.length === 0 ? '<div class="empty-state"><p class="text-gray-500">You have not listed any property yet.</p></div>' : `
        <div class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          ${myProps.map(p => propertyCard(p, true)).join('')}
        </div>
      `}
    `;
  }

  // Talent view: all properties with apply button
  return `
    <div class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      ${properties.map(p => propertyCard(p, false)).join('')}
    </div>
  `;
}

function propertyCard(prop, ownerView) {
  const img = prop.images[0] || 'https://via.placeholder.com/600x400';
  return `
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <img src="${img}" alt="${prop.title}" class="h-48 w-full object-cover" />
      <div class="p-4">
        <div class="flex justify-between items-start">
          <h3 class="text-lg font-semibold">${prop.title}</h3>
          <span class="text-green-600 font-bold">₦${prop.price.toLocaleString()}</span>
        </div>
        <p class="text-gray-500 text-sm"><i class="fas fa-map-marker-alt mr-1"></i> ${prop.location}</p>
        <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold mt-2 inline-block">${prop.type}</span>
        <p class="mt-2 text-gray-600 line-clamp-2">${prop.description || ''}</p>
      </div>
      <div class="px-4 pb-4 flex justify-between">
        ${ownerView ? `
          <button onclick="editProperty('${prop._id}')" class="text-indigo-600 hover:text-indigo-800"><i class="fas fa-edit"></i> Edit</button>
          <button onclick="deleteProperty('${prop._id}')" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i> Delete</button>
        ` : `
          <button onclick="applyToProperty('${prop._id}')" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"><i class="fas fa-paper-plane mr-1"></i> Apply</button>
        `}
      </div>
    </div>
  `;
}

async function deleteProperty(id) {
  if (!confirm('Delete this property?')) return;
  try {
    await api(`/properties/${id}`, { method: 'DELETE' });
    showToast('Property deleted');
    navigateTo('properties'); // reload
  } catch (err) {
    showToast('Error: ' + err.message);
  }
}

function openPropertyModal(property = {}) {
  const modalHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this)closeModal()">
      <div class="modal-content">
        <h2 class="text-lg font-semibold mb-4">${property._id ? 'Edit Property' : 'New Property'}</h2>
        <form onsubmit="saveProperty(event, '${property._id || ''}')" class="space-y-3">
          <input type="text" name="title" placeholder="Title" value="${property.title || ''}" required class="w-full p-2 border rounded" />
          <input type="text" name="location" placeholder="Location (e.g. Yaba, Lagos)" value="${property.location || ''}" required class="w-full p-2 border rounded" />
          <input type="number" name="price" placeholder="Price (₦)" value="${property.price || ''}" required min="0" class="w-full p-2 border rounded" />
          <select name="type" class="w-full p-2 border rounded">
            <option value="Studio" ${property.type === 'Studio' ? 'selected' : ''}>Studio</option>
            <option value="1 Bedroom" ${property.type === '1 Bedroom' ? 'selected' : ''}>1 Bedroom</option>
            <option value="2 Bedrooms" ${property.type === '2 Bedrooms' ? 'selected' : ''}>2 Bedrooms</option>
            <option value="Self Contain" ${property.type === 'Self Contain' ? 'selected' : ''}>Self Contain</option>
            <option value="Shared" ${property.type === 'Shared' ? 'selected' : ''}>Shared</option>
          </select>
          <textarea name="description" placeholder="Description" rows="3" class="w-full p-2 border rounded">${property.description || ''}</textarea>
          <input type="file" id="imageUpload" accept="image/*" onchange="uploadAndAddImage()" class="w-full p-2 border rounded" />
          <input type="hidden" name="images" id="selectedImages" value="${(property.images || []).join(',')}" />
          <div id="imagePreview" class="flex gap-2 mt-2">${property.images?.map(img => `<img src="${img}" class="h-16 w-16 rounded-md object-cover" />`).join('') || ''}</div>
          <div class="flex justify-end gap-2">
            <button type="button" onclick="closeModal()" class="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.getElementById('modalContainer').innerHTML = modalHTML;
}

async function uploadAndAddImage() {
  const fileInput = document.getElementById('imageUpload');
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64 = e.target.result;
    try {
      const { url } = await api('/upload', { method: 'POST', body: { image: base64 } });
      const imgField = document.getElementById('selectedImages');
      const preview = document.getElementById('imagePreview');
      imgField.value = imgField.value ? `${imgField.value},${url}` : url;
      preview.innerHTML += `<img src="${url}" class="h-16 w-16 rounded-md object-cover" />`;
    } catch (err) {
      showToast('Upload failed: ' + err.message);
    }
  };
  reader.readAsDataURL(file);
}

async function saveProperty(e, id = '') {
  e.preventDefault();
  const form = e.target;
  const body = Object.fromEntries(new FormData(form).entries());
  body.price = Number(body.price);
  body.images = body.images.split(',').filter(url => url);

  try {
    if (id) {
      await api(`/properties/${id}`, { method: 'PUT', body });
      showToast('Property updated');
    } else {
      await api('/properties', { method: 'POST', body });
      showToast('Property added');
    }
    closeModal();
    navigateTo('properties');
  } catch (err) {
    showToast('Error: ' + err.message);
  }
}

async function applyToProperty(propertyId) {
  // Optimistic update: disable button visually
  document.querySelectorAll('button[data-propid]').forEach(btn => {
    if (btn.dataset.propid === propertyId) {
      btn.textContent = 'Applied!';
      btn.disabled = true;
    }
  });

  try {
    await api('/applications', { method: 'POST', body: { propertyId } });
    showToast('Application sent!');
  } catch (err) {
    // Rollback
    showToast('Error: ' + err.message);
    navigateTo('properties'); // revert UI
  }
}
