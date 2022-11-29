
const express = require("express");
const fs = require("fs");
const http = require('http');//
const path = require('node:path');//
const multer  = require("multer");//
//const upload = multer({ dest: 'uploads/' });
const storage = multer.memoryStorage();//
const upload = multer({ storage: storage });//
const bodyParser = require("body-parser");//
    
const app = express();
const jsonParser = express.json();
  
app.use(express.static(__dirname + "/public"));
  
const filePath2 = "users.json";
const filePath = "/FilesLab/";

app.get("/api/file/create/:filename(*)", function(req, res){
    let filename = "FilesLab/" + req.params.filename;
    fs.writeFile(filename, "Текст", function(err){
        if (err) {
            console.log(err);
            res.send("err2");
        } else {
            console.log("Файл создан");
            res.send("Файл создан2");
        }
    });
});
app.get("/api/folder/create/:filename(*)", function(req, res){
    let filename = "FilesLab/" + req.params.filename;
    fs.mkdir(filename, err => {
        if(err) throw err; // не удалось создать папку
        console.log('Папка успешно создана');
        res.send("папка создана2");
    });
});
app.delete("/api/file/delete/:filename(*)", function(req, res){
    let filename = "FilesLab/" + req.params.filename;
    fs.unlink(filename, function(err){
        if (err) {
            console.log(err);
            res.send("err2");
        } else {
            console.log("Файл удалён " + req.params.filename);
            res.send(req.params.filename);
        }
    });
});
app.delete("/api/folder/delete/:filename(*)", function(req, res){
    let filename = "FilesLab/" + req.params.filename;
    fs.rmdir(filename, err => {
        if(err) throw err; // не удалось удалить папку
        console.log('Папка успешно удалена ' + req.params.filename);
        res.send(req.params.filename);
    });
});
app.get('/api/file/download/:file(*)', (req, res) => {

    let file = req.params.file;
    let fileLocation = path.join('./FilesLab', file);

    console.log(fileLocation);
    res.download(fileLocation, file);
});

app.post("/api/file/*", upload.single("uploadFile"), (req, res) => {
    let filePath = path.join(__dirname, `${req.url.slice(10)}`);
    const file = req.file;
    fs.writeFile(
        `${filePath}${file.originalname}`,
        file.buffer,
        function (err) {
            if (err) return console.log(err);
            console.log("file uploaded");
        }
    );
    res.redirect(`/`);
});

app.get('/api/folder/count', (req, res) => {
    let filename = "FilesLab/";
    fs.readdir(filename, (err, files) => {
        if(err) throw err; // не прочитать содержимое папки
        console.log('В папке находятся файлы:' + files);
        res.send(files);
    });
});

   
app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});