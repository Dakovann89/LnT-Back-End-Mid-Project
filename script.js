const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#0ea5e9','#84cc16'];

let employees = [];

let nextId = 1;
let editingId  = null;
let deleteId   = null;
let searchQuery = '';

const colorMap = {};

function getColor(id) {
  if (!colorMap[id]) colorMap[id] = COLORS[(id - 1) % COLORS.length];
  return colorMap[id];
}

function initials(name) {
  return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function render() {
  const q = searchQuery.toLowerCase();
  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.address.toLowerCase().includes(q) ||
    e.phone.includes(q)
  );

  document.getElementById('totalCount').textContent = filtered.length;

  const tbody = document.getElementById('tableBody');
  const empty = document.getElementById('emptyState');

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  tbody.innerHTML = filtered.map((e, i) => `
    <tr style="animation-delay:${i * 0.04}s">
      <td><span class="row-no">${i + 1}</span></td>
      <td>
        <div class="employee-cell">
          <div class="avatar" style="background:${getColor(e.id)}">${initials(e.name)}</div>
          <div>
            <div class="emp-name">${e.name}</div>
          </div>
        </div>
      </td>
      <td style="text-align:center"><span class="age-badge">${e.age}</span></td>
      <td>${e.address}</td>
      <td>${e.phone}</td>
      <td>
        <div class="action-btns" style="justify-content:flex-end">
          <button class="btn-icon edit" title="Edit" onclick="openEditModal(${e.id})">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/>
            </svg>
          </button>
          <button class="btn-icon delete" title="Delete" onclick="openDeleteModal(${e.id})">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

document.getElementById('searchInput').addEventListener('input', e => {
  searchQuery = e.target.value;
  render();
});

function openAddModal() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Add New Employee';
  document.getElementById('modalSubtitle').textContent = 'Fill in the details to register a new employee.';
  document.getElementById('btnSaveLabel').innerHTML = `
    <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
    </svg>
    Add Employee`;
  clearForm();
  document.getElementById('formModal').classList.add('active');
}

function openEditModal(id) {
  editingId = id;
  const emp = employees.find(e => e.id === id);
  document.getElementById('modalTitle').textContent = 'Edit Employee';
  document.getElementById('modalSubtitle').textContent = 'Update the details of this employee.';
  document.getElementById('btnSaveLabel').innerHTML = `
    <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/>
    </svg>
    Save Changes`;
  document.getElementById('fieldName').value    = emp.name;
  document.getElementById('fieldAge').value     = emp.age;
  document.getElementById('fieldAddress').value = emp.address;
  document.getElementById('fieldPhone').value   = emp.phone;
  clearErrors();
  document.getElementById('formModal').classList.add('active');
}

function closeFormModal() {
  document.getElementById('formModal').classList.remove('active');
  clearForm();
}

function clearForm() {
  ['fieldName','fieldAge','fieldAddress','fieldPhone'].forEach(id => {
    document.getElementById(id).value = '';
  });
  clearErrors();
}

function clearErrors() {
  ['Name','Age','Address','Phone'].forEach(f => {
    document.getElementById('err'   + f).classList.remove('visible');
    document.getElementById('field' + f).classList.remove('error');
  });
}

function showError(field, msg) {
  const el = document.getElementById('err' + field);
  el.textContent = msg;
  el.classList.add('visible');
  document.getElementById('field' + field).classList.add('error');
}

function saveEmployee() {
  const name    = document.getElementById('fieldName').value.trim();
  const age     = parseInt(document.getElementById('fieldAge').value);
  const address = document.getElementById('fieldAddress').value.trim();
  const phone   = document.getElementById('fieldPhone').value.trim();

  clearErrors();
  let valid = true;

  if (name.length < 5 || name.length > 20)          { showError('Name',    'Name must be 5–20 characters.');                  valid = false; }
  if (!age || age <= 20)                             { showError('Age',     'Age must be greater than 20.');                   valid = false; }
  if (address.length < 10 || address.length > 40)   { showError('Address', 'Address must be 10–40 characters.');              valid = false; }
  if (!/^08\d{7,10}$/.test(phone))                  { showError('Phone',   'Phone must be 9-12 digits and start with 08.');   valid = false; }

  if (!valid) return;

  if (editingId) {
    const idx = employees.findIndex(e => e.id === editingId);
    employees[idx] = { ...employees[idx], name, age, address, phone };
    toast('Employee updated successfully.');
  } else {
    employees.push({ id: nextId++, name, age, address, phone });
    toast('Employee added successfully.');
  }

  closeFormModal();
  render();
}

function openDeleteModal(id) {
  deleteId = id;
  const emp = employees.find(e => e.id === id);
  document.getElementById('deleteName').textContent = emp.name;
  document.getElementById('confirmModal').classList.add('active');
}

function closeConfirmModal() {
  document.getElementById('confirmModal').classList.remove('active');
  deleteId = null;
}

function confirmDelete() {
  employees = employees.filter(e => e.id !== deleteId);
  closeConfirmModal();
  render();
  toast('Employee deleted.', true);
}

document.getElementById('formModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeFormModal();
});

document.getElementById('confirmModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeConfirmModal();
});

function toast(msg, isDelete = false) {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<div class="toast-dot${isDelete ? ' red' : ''}"></div>${msg}`;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    el.addEventListener('animationend', () => el.remove());
  }, 3000);
}

render();