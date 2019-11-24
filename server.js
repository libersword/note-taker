const express = require("express");
const path = require("path");
const fs = require('fs');
var app = express();
var PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
const db = path.join(__dirname, "/db/db.json");

let parsedNotes = JSON.parse(
  fs.readFileSync(db, function(err, data){
    if(err) throw err;
  })
)
let writeTo = parsedNotes => {
  let n = parsedNotes.filter(function(e){
    return e != null;
  });
  fs.writeFileSync(
    path.join(__dirname, '/db/db.json'),
    JSON.stringify(n),
    function(err){
      if (err) throw err;
    }
  )
};

// GET REQUESTS
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("/index", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function(req, res) {
  return res.json(parsedNotes);
});

// app.get("/api/notes/:id", function(req, res) {
//   let chosen = req.params.id;
//   for (var i = 0; i < parsedNotes.length; i++) {
//     if (chosen === parsedNotes[i].routeName) {
//       return res.json(parsedNotes[i]);
//     }
//   }

//   return res.json(false);
// });

let idInc = 1;
app.post("/api/notes", function(req, res) {
  let newEntry = req.body;
  newEntry.id = idInc;
  idInc++;
  parsedNotes.push(newEntry);
  writeTo(parsedNotes);
  return res.json(parsedNotes);
});

app.delete('/api/notes/:id', function(req, res){
  let id = req.params.id;
  delete parsedNotes[id -1];
  writeTo(parsedNotes);
  res.send(parsedNotes);
})

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
