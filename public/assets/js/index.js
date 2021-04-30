const $noteTitle = $('.note-title');
const $noteText = $('.note-textarea');
const $saveNoteBtn = $('.save-note');
const $addNoteBtn = $('.new-note');
const $noteList = $('.list-container .list-group');

// activeNote used to track the note in the textarea
let activeNote = {};

//Get all notes from the db file
let getNotes = function () {
    return $.ajax({
        url: '/api/notes',
        method: 'GET'
    });
};

//Save note to the db
let saveNote = function (note) {
    return $.ajax({
        url: '/api/notes',
        data: note,
        method: 'POST'
    });
};
// Delete note from the db
let deleteNote = function (id) {
    return $.ajax({
        url: 'api/notes/' + id,
        method: 'DELETE'
    })
};
let renderActiveNote = function () {
    $saveNoteBtn.hide();

    if (typeof activeNote.id === 'number') {
        $noteTitle.attr('readonly', true);
        $noteText.attr('readonly', true);
        $noteTitle.val(activeNote.title);
        $noteText.val(activeNote.text);
    } else {
        $noteTitle.attr('readonly', false);
        $noteText.attr('readonly', false);
        $noteTitle.val('');
        $noteText.val('');
    }
};

let handleNoteSave = function () {
    var addNote = {
        title: $noteTitle.val(),
        text: $noteText.val(),
    };
    saveNote(addNote);
        getAndRenderNotes();
        renderActiveNote();
  
};
// Delete the clicked note
let handleNoteDelete = function (e) {
    // prevents the click listener from being called when the button inside of it is clicked
    e.stopPropagation();

    var note = $(this).data('id');
    if (activeNote.id === note) {
        activeNote = {};
    }
    deleteNote(note);
        getAndRenderNotes();
        renderActiveNote();
};
// Set the activeNote and display it
let handleNoteView = function () {
    activeNote = $(this).data();
    renderActiveNote();
};
// Sets the activeNote to an empty object and allows the user to enter a new note
let handleaddNoteView = function () {
    activeNote = {};
    renderActiveNote();
};
// Hide/show the save button
let handleRenderSaveBtn = function () {
    if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
        $saveNoteBtn.hide();
    } else {
        $saveNoteBtn.show();
    }
};
// Render the note list
let renderNoteList = function (notes) {
    $noteList.empty();
    var noteListItems = [];
    
    for (i = 0; i < notes.length; i++) {
        let note = notes[i];
        var $li = $("<li class='list-group-item'>").data(note);
        $li.data('id',i);
        var $span = $('<span>').text(note.title);
        var $delBtn = $("<i class='fas fa-trash-alt float-right text-danger delete-note' data-id="+i+">");
        $li.append($span, $delBtn);
        noteListItems.push($li);
    }
    $noteList.append(noteListItems);
};
// Get notes from DB and render to the sidebar
let getAndRenderNotes = function () {
    return getNotes().then((data) => {
        renderNoteList(data);
    });
};

$saveNoteBtn.on('click', handleNoteSave);
$noteList.on('click', '.list-group-item', handleNoteView);
$addNoteBtn.on('click', handleaddNoteView);
$noteList.on('click', '.delete-note', handleNoteDelete);
$noteTitle.on('keyup', handleRenderSaveBtn);
$noteText.on('keyup', handleRenderSaveBtn);

getAndRenderNotes();