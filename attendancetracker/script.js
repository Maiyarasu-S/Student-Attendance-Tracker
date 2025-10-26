// script.js

const addStudentBtn = document.getElementById('addStudentBtn');
const studentNameInput = document.getElementById('studentName');
const attendanceTable = document.getElementById('attendanceTable').querySelector('tbody');
const monthInput = document.getElementById('monthSelect');
const offDay1Select = document.getElementById('offDay1');
const offDay2Select = document.getElementById('offDay2');

// Month names shorthand
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Function to get days in a month
function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

// Function to generate table header for selected month
function generateTableHeader(month, year) {
    const thead = document.getElementById('attendanceTable').querySelector('thead');
    let headerRow = `<tr><th>Student Name</th>`;

    const daysInMonth = getDaysInMonth(month, year);
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        headerRow += `<th data-day="${dayName}">${i < 10 ? '0'+i : i}-${monthNames[month]}<br><small>${dayName}</small></th>`;
    }

    headerRow += `<th>Percentage</th><th>Actions</th></tr>`;
    thead.innerHTML = headerRow;

    // Update off-days immediately after generating table
    updateOffDays();
}

// Default month: October
const defaultMonth = 9;
const defaultYear = new Date().getFullYear();
generateTableHeader(defaultMonth, defaultYear);

// Event: when month changes
monthInput.addEventListener('change', () => {
    const selectedDate = new Date(monthInput.value);
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    generateTableHeader(month, year);

    // Clear previous students when month changes
    attendanceTable.innerHTML = '';
});

// Event: add student
addStudentBtn.addEventListener('click', () => {
    const name = studentNameInput.value.trim();
    if (!name) return alert("Enter student name first.");
    
    // Get number of date columns dynamically
    const totalCols = document.getElementById('attendanceTable').querySelectorAll('thead th').length;
    const dateCols = totalCols - 3; // subtract Student Name + Percentage + Actions
    
    let row = `<tr><td>${name}</td>`;
    for (let i = 0; i < dateCols; i++) {
        row += `<td><input type="checkbox" class="attendance-checkbox"></td>`;
    }
    row += `<td class="percentage">0%</td>`;
    row += `<td><button class="deleteBtn">Delete</button></td></tr>`;
    
    attendanceTable.insertAdjacentHTML('beforeend', row);
    studentNameInput.value = '';

    // Update percentage on checkbox click
    const checkboxes = attendanceTable.querySelectorAll('.attendance-checkbox');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', updatePercentage);
    });

    // Delete student
    const deleteBtns = attendanceTable.querySelectorAll('.deleteBtn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('tr').remove();
        });
    });

    // Update off-days after adding new student
    updateOffDays();
});

// Function to update percentage dynamically
function updatePercentage() {
    const rows = attendanceTable.querySelectorAll('tr');
    rows.forEach(row => {
        const checkboxes = row.querySelectorAll('.attendance-checkbox');
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        const percent = checkboxes.length ? Math.round((checkedCount / checkboxes.length) * 100) : 0;
        row.querySelector('.percentage').textContent = percent + '%';
    });
}

// --- Off-Days Feature ---
function updateOffDays() {
    const offDays = [offDay1Select.value, offDay2Select.value];

    const headers = document.querySelectorAll('#attendanceTable thead th');
    const rows = attendanceTable.querySelectorAll('tr');

    headers.forEach((th, colIndex) => {
        const dayName = th.dataset.day;
        if (!dayName) return;

        const shouldDisable = offDays.includes(dayName);

        rows.forEach(row => {
            const checkbox = row.children[colIndex]?.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.disabled = shouldDisable;
                if (shouldDisable) checkbox.checked = false; // uncheck if disabling
            }
        });
    });

    updatePercentage();
}

// Attach change events to off-day selects
offDay1Select.addEventListener('change', updateOffDays);
offDay2Select.addEventListener('change', updateOffDays);

// Clear Data Button
const clearDataBtn = document.getElementById('clearDataBtn');

clearDataBtn.addEventListener('click', () => {
    if (attendanceTable.rows.length === 0) return; // nothing to clear
    if (confirm("Are you sure you want to clear all student data?")) {
        attendanceTable.innerHTML = '';
    }
});
