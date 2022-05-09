// Inital setup
const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();
// id Generator
const uuid = () =>
Math.floor((1 + Math.random()) * 0x10000)
  .toString(16)
  .substring(1);

// basic app setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET request setting the homepage file
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});
// GET request setting the /notes page file
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html' ))
});
// GET requset for the previous notes
app.get('/api/notes', (req,res) => {
    console.log(`${req.method} successfull`)
    fs.readFile('./db/db.json','utf8', (err,data) => {
        if (err) {
            console.error(err)
        } else {
       try { 
           const notes = JSON.parse(data);
            res.json(notes);
       } catch(err) {
           console.error(err)
       }
        }
        
    })

    
    

});
// POST request to save the new note
app.post('/api/notes', (req,res) => {
    const {title,text} = req.body;
    const newNote = {
        title,
        text,
        id: uuid()
    };

    //Retrives notes data from db.json 
    fs.readFile('./db/db.json','utf8',(err,data) => {
        if (err) {
            
            console.error(err);
        } else {
            try{
            const parsedNotes = JSON.parse(data);
            parsedNotes.push(newNote);
            // Writing new notes to db.json
            fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Success')
                }
            });
        } catch(err) {
            const newNoteString = JSON.stringify(newNote);
            // Writing first note as an array
            fs.writeFile('./db/db.json', '['+newNoteString+']', (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Success')
                }
            });
        }
        }
    });
    res.json(newNote);
    console.log(`${req.method} successfull`);

});

// Setting the app to listen
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
});
