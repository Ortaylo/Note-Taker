const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = 3001;
const app = express();
const uuid = () =>
Math.floor((1 + Math.random()) * 0x10000)
  .toString(16)
  .substring(1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html' ))
});

app.get('/api/notes', (req,res) => {
    console.log(`${req.method} successfull`)
console.info('GET BODY',req.body)
    fs.readFile('./db/db.json','utf8', (err,data) => {
        if (err) {
            console.error(err)
        } else {
        const notes = JSON.parse(data);
        res.json(notes);
        }
        
    })

    
    

});

app.post('/api/notes', (req,res) => {
    const {title,text} = req.body;
    const newNote = {
        title,
        text,
        id: uuid()
    };
    console.info(newNote)

    fs.readFile('./db/db.json','utf8',(err,data) => {
        if (err) {
            
            console.error(err);
        } else {
            try{
            const parsedNotes = JSON.parse(data);
            parsedNotes.push(newNote);
            fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Success')
                }
            });
        } catch(err) {
            console.info('newNote',newNote)
            const newNoteString = JSON.stringify(newNote);
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
    console.info('body:',req.body);
    console.info('newNote:',newNote);
    console.log(`${req.method} successfull`);

});
let id;
app.delete(`/api/notes`, (req,res) => {
    console.info`${req.method} Successfull`
    console.info(req.body)
})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
});
