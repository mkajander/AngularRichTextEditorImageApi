var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// cors
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// cors
app.use(cors());
app.options('*', cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;

const multer = require("multer");

const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

const upload = multer({
    dest: "./public/images",
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

app.post(
    "/upload",
    upload.single("file" /* name attribute of <file> element in your form */),
    (req, res) => {
        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, "./uploads/image.png");

        if (path.extname(req.file.originalname).toLowerCase() === ".png") {
            fs.rename(tempPath, targetPath, err => {
                if (err) return handleError(err, res);


                res.status(200).send({
                    "status":true,
                    "originalName": req.file.originalName,
                    "generatedName":req.file.generatedName,
                    "msg":"Image upload successful",
                    "imageUrl":`localhost:3000/images/image.png`
                })
            });
        } else {
            fs.unlink(tempPath, err => {
                if (err) return handleError(err, res);

                res
                    .status(403)
                    .contentType("text/plain")
                    .end("Only .png files are allowed!");
            });
        }
    }
);

app.get("/images/:image", (req, res) => {
    const file = `./public/images/${req.params.image}`;
    res.sendFile(path.resolve(file));
});

// start the server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
