/*Задание 2 - написать на языке JS серверное (node.js) и клиентское веб приложение реализующее json API методы для доступа к файловой системе.

Необходимо реализовать серверное node.js приложение, предоставляющее доступ к локальной файловой системе по протоколу Rest. Приложение по url / должно отдавать код клиентского js.
Необходимо реализовать приложение - тонкий клиент (исполняемое в браузере) с использованием стандартного JS или любого популярного программного каркаса Vue.js, Angular, React и т.п..
Требуется реализовать методы перечисления файлов и папок по передаваемому пути, удаленное скачивание файлов.

По желанию список может быть расширен заливкой/удалением файлов, создание и удаление пустых папок и т.п. - оценивается дополнительно в 1 балл (максимум 6).

Для успешной сдачи необходимо предоставить текстовое описание протокола. */
const express = require("express");
const fs = require("fs");
const http = require('http');//
const path = require('node:path');//
    
const app = express();
const jsonParser = express.json();
  
app.use(express.static(__dirname + "/public"));
  
const filePath2 = "users.json";
const filePath = "/FilesLab/";

app.get("/api/file/create/:filename(*)", function(req, res){
    /*
    fs.open('testFile.txt', 'w', (err) => {
        if(err) throw err;
        console.log('File created');
    });
    */
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
    /*
    fs.open('testFile.txt', 'w', (err) => {
        if(err) throw err;
        console.log('File created');
    });
    */
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
    //return res.download(fileLocation, file);
    
    //res.download('./FilesLab', 'file123.txt');

   /*
    res.download('./FilesLab/Box.txt', function(err) {
        if(err) {
            console.log(err);
        }
    })   
    */ 
});
app.get('/api/folder/count', (req, res) => {
    /*
    path1 = 'FilesLab/';
    str = listObjects(path1);

    console.log(str);
    res.send(str);
    */
    let filename = "FilesLab/";
    fs.readdir(filename, (err, files) => {
        if(err) throw err; // не прочитать содержимое папки
        console.log('В папке находятся файлы:' + files);
        res.send(files);
    });
});

function listObjects(path){
    let string1 = '';
    fs.readdir(path, (err, files) => {
       if(err) throw err;
 
       for (let file of files){
          fs.stat('file.txt', (errStat, status) => {
             if(errStat) throw errStat;
 
             if(status.isDerictory()){
                string1 = string1 + 'Папка: ' + file;
                console.log('Папка: ' + file);
                listObjects(path + '/' + file); // продолжаем рекурсию
             }else{
                string1 = string1 + 'Файл: ' + file;
                console.log('Файл: ' + file);
             }
          });
       }
    });
    return string1;
 }
   
app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});