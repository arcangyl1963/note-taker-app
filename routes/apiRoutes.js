const fs = require('fs');

module.exports = (app) => {
  let notes = [];
  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    notes = JSON.parse(data);
  });
  // Set the API route to retrieve notes
  app.get('/api/notes', (req, res) => res.json(notes));
  // retrieve a single note by id
  app.get('/api/notes/:id', (req, res) => res.json(notes[req.params.id]));
  // Set the API route to add a note
  app.post('/api/notes', (req, res) => {
    let addNote = req.body;
    notes.push(addNote);
    writeToDB();
    return console.log(`${addNote.title} was added.`);
  });
  // Delete note by id function
  app.delete('/api/notes/:id', (req, res) => {notes.splice(req.params.id, 1);
  writeToDB();
  console.log(`Note ${req.params.id} was deleted`);
  });
  // Adds or deletes a note to the JSON file
  writeToDB = () => {
    fs.writeFile('db/db.json', JSON.stringify(notes, '\n'), (err) => {
      if (err) throw err;
      return true;
    });
  };
};
