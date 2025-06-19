document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const addModal = document.getElementById('addModal');
    const editModal = document.getElementById('editModal');
    const addBtn = document.getElementById('addStudentBtn');
    const addForm = document.getElementById('addForm');
    const editForm = document.getElementById('editForm');

    // Open Add Modal
    addBtn.onclick = () => {
        addModal.style.display = 'flex';  // Use flex if your CSS uses flexbox for modal
    };

    // Close Add Modal
    window.closeModal = function() {
        addModal.style.display = 'none';
    };

    // Close Edit Modal
    window.closeEditModal = function() {
        editModal.style.display = 'none';
    };

    // Submit Add Form
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            name: addForm.name.value.trim(),
            subject: addForm.subject.value.trim(),
            marks: parseInt(addForm.marks.value.trim())
        };

        try {
            const response = await fetch('/add_student', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.status === 'created') {
                closeModal();
                Swal.fire('Success', 'New student added', 'success').then(() => location.reload());
            } else if (result.status === 'updated') {
                closeModal();
                Swal.fire('Updated', `Marks updated. New total: ${result.new_marks}`, 'success').then(() => location.reload());
            } else {
                Swal.fire('Error', result.message || 'Unknown error', 'error');
            }

        } catch {
            alert('Failed to submit student data');
        }
    });

    // Open Edit Modal with prefilled values
    window.updateStudent = function(id) {
        const row = document.querySelector(`tr[data-id='${id}']`);
        if (!row) {
            Swal.fire('Error', 'Student not found', 'error');
            return;
        }

        const nameCell = row.children[0];
        const name = nameCell.querySelector('.avatar') 
            ? nameCell.innerText.replace(nameCell.querySelector('.avatar').innerText, '').trim()
            : nameCell.innerText.trim();
            
        const subject = row.children[1].innerText.trim();
        const marks = row.children[2].innerText.trim();

        editForm.id.value = id;
        editForm.name.value = name;
        editForm.subject.value = subject;
        editForm.marks.value = marks;

        editModal.style.display = 'flex';
    };


    // Submit Edit Form
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = editForm.id.value;
        const data = {
            name: editForm.name.value.trim(),
            subject: editForm.subject.value.trim(),
            marks: parseInt(editForm.marks.value.trim())
        };

        try {
            const response = await fetch(`/update_student/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.status === 'updated') {
                closeEditModal();
                Swal.fire('Success', 'Update successful', 'success').then(() => location.reload());
            } else {
                Swal.fire('Error', 'Error updating student', 'error');
            }
        } catch {
            alert('Failed to update student');
        }
    });

    // Delete Student
    window.deleteStudent = async function(id) {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: "This student will be deleted.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirm.isConfirmed) {
            try {
                const response = await fetch(`/delete_student/${id}`, { method: 'POST' });
                const result = await response.json();
                if (result.status === 'deleted') {
                    Swal.fire('Deleted!', 'Student has been deleted.', 'success').then(() => location.reload());
                } else {
                    Swal.fire('Error', 'Error deleting student', 'error');
                }
            } catch {
                Swal.fire('Error', 'Failed to delete student', 'error');
            }
        }
    };

    // Dropdown Toggle
    window.toggleDropdown = function(btn) {
        const dropdown = btn.closest('.dropdown');
        const openDropdown = document.querySelector('.dropdown.open');
        if (openDropdown && openDropdown !== dropdown) {
            openDropdown.classList.remove('open');
        }
        dropdown.classList.toggle('open');
    };

    // Close dropdown and modals on outside click
    window.addEventListener('click', (e) => {
        // Close dropdown if clicked outside .action-btn or dropdown content
        if (!e.target.matches('.action-btn') && !e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
        }

        // Close Add Modal if clicking outside modal content
        if (e.target === addModal) {
            closeModal();
        }

        // Close Edit Modal if clicking outside modal content
        if (e.target === editModal) {
            closeEditModal();
        }
    });

});



function togglePassword() {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.innerHTML = `
            <!-- Eye Slash (Hide) -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.978 9.978 0 012.192-3.568m3.414-2.121A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.975 9.975 0 01-4.222 5.07M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3l18 18" />
            </svg>`;
    } else {
        passwordInput.type = "password";
        eyeIcon.innerHTML = `
            <!-- Eye (Visible) -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>`;
    }
}