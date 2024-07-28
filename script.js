function toggleMenu() {
   const menu = document.querySelector(".menu-links");
   const icon = document.querySelector(".hamburger-icon");
   menu.classList.toggle("open");
   icon.classList.toggle("open");
 }

// Note-taking functionality
const noteInput = document.getElementById('noteInput');
const saveNoteBtn = document.getElementById('saveNote');
const notesList = document.getElementById('notesList');

let notes = [];
let editingNoteId = null;

saveNoteBtn.addEventListener('click', () => {
    const noteText = noteInput.value.trim();
    if (noteText) {
        if (editingNoteId !== null) {
            // Update existing note
            const noteIndex = notes.findIndex(note => note.id === editingNoteId);
            notes[noteIndex].content = noteText;
            editingNoteId = null;
            saveNoteBtn.textContent = 'Save Note';
        } else {
            // Add new note
            const newNote = {
                id: Date.now(),
                content: noteText,
                createdAt: new Date().toISOString()
            };
            notes.push(newNote);
        }
        noteInput.value = '';
        renderNotes();
        saveNotes();
    }
});

function renderNotes() {
    notesList.innerHTML = '';
    notes.forEach(note => {
        const noteElement = createNoteElement(note);
        notesList.appendChild(noteElement);
    });
}

function createNoteElement(note) {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note-item');
    noteElement.innerHTML = `
        <div class="note-content">${note.content}</div>
        <div class="note-actions">
            <button class="edit-note">Edit</button>
            <button class="delete-note">Delete</button>
        </div>
    `;

    const editBtn = noteElement.querySelector('.edit-note');
    const deleteBtn = noteElement.querySelector('.delete-note');

    editBtn.addEventListener('click', () => editNote(note));
    deleteBtn.addEventListener('click', () => deleteNote(note.id));

    return noteElement;
}

function editNote(note) {
    noteInput.value = note.content;
    editingNoteId = note.id;
    saveNoteBtn.textContent = 'Update Note';
    noteInput.focus();
}

function deleteNote(noteId) {
    notes = notes.filter(note => note.id !== noteId);
    renderNotes();
    saveNotes();
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = savedNotes;
    renderNotes();
}

// Load saved notes when the page loads
loadNotes();
