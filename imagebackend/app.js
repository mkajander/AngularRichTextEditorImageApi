const cors = require('cors');
const express = require('express');

const app = express();
// eslint-disable-next-line no-unused-vars
const bodyParser = require('body-parser');
router  = express.Router();

const multer = require('multer');

const DIR = './public/';
// eslint-disable-next-line no-unused-vars
const fs = require('fs');
const path = require('path');
const {response} = require("express");

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    }),
);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + path.extname(file.originalname);
        cb(null, fileName);
    },
});

//get static images
app.use('/images', express.static('public'));

const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

const upload = multer({
    storage,
    limits: {fileSize: 5 * 1024 * 1024, fieldSize: 5 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        console.log(`Got file ${file.originalname} with type ${file.mimetype}.`);
        if (
            file.mimetype === 'image/png'
            || file.mimetype === 'image/jpg'
            || file.mimetype === 'image/jpeg'
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
});



app.post( '/api/images', upload.single( 'file' ),async (req, res, next) => {
            res.status(200).send({
                "status":true,
                "originalName": req.file.originalName,
                "generatedName": req.file.filename,
                "msg":"Image upload successful",
                "imageUrl":`http://localhost:3000/images/${req.file.filename}`
            })
});


// app.post('/api/images', async (req, res) => {
//     // Here you do the uploading. The way you do is up to you.
//     console.log('in upload route');
//     upload.single(req, res, async (err) => {
//         if (err) {
//             // ...it failed, send a failure response via `res`...
//             console.log(err);
//             res.status(500).send(err);
//         } else {
//             console.log(req.file);
//
//             // never should be multiple
//             console.log(req.files);
//             const picture = req.files[0].filename;
//             const imageurl = `http://localhost:3000/images/${req.files[0].filename}`;
//             console.log(req.file.filename);
//             res.status(200).send({
//                 "status":true,
//                 "originalName":'demoImage.jpg',
//                 "generatedName":'demoImage.jpg',
//                 "msg":"Image upload successful",
//                 "imageUrl":`https://storage.googleapis.com/article-images/demoImage.jpg`
//             })
//             responseBody ={
//                 "status":true,
//                 "originalName": picture.originalName,
//                 "generatedName": picture.generatedName,
//                 "msg":"Image upload successful",
//                 "imageUrl":imageurl
//             };
//         }
//     });
// });

/*
app.get("/images/:image", (req, res) => {
    const file = `./public/images/${req.params.image}`;
    res.sendFile(path.resolve(file));
});
*/

// start the server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
module.exports = app;
