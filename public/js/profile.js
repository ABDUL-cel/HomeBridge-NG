async function renderProfile() {
  const me = await api('/talents/me');
  return `
    <div class="max-w-xl mx-auto">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Talent Profile</h2>
        <div class="flex items-center space-x-4 mb-6">
          <img src="${me.avatarUrl || 'https://via.placeholder.com/100'}" class="w-20 h-20 rounded-full object-cover" />
          <div>
            <p class="font-bold text-lg">${user.name}</p>
            <p class="text-gray-500">${me.profession || 'No profession set'}</p>
          </div>
        </div>
        <form id="profileForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium">Profession</label>
            <input name="profession" value="${me.profession || ''}" class="w-full p-2 border rounded" placeholder="e.g. Photographer" />
          </div>
          <div>
            <label class="block text-sm font-medium">Location</label>
            <input name="location" value="${me.location || ''}" class="w-full p-2 border rounded" placeholder="e.g. Lagos" />
          </div>
          <div>
            <label class="block text-sm font-medium">Bio</label>
            <textarea name="bio" rows="4" class="w-full p-2 border rounded" placeholder="Describe your skills and availability">${me.bio || ''}</textarea>
          </div>
          <div>
            <label class="block text-sm font-medium">Skills (comma separated)</label>
            <input name="skills" value="${me.skills.join(', ')}" class="w-full p-2 border rounded" placeholder="e.g. Photography, Editing, UI" />
          </div>
          <label class="flex items-center gap-2">
            <input type="checkbox" name="availability" ${me.availability ? 'checked' : ''} class="rounded" />
            Available for housing
          </label>
          <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Profile</button>
        </form>
      </div>
    </div>
  `;
}
