/*Задание 2 - написать на языке JS серверное (node.js) и клиентское веб приложение реализующее json API методы для доступа к файловой системе.

Необходимо реализовать серверное node.js приложение, предоставляющее доступ к локальной файловой системе по протоколу Rest. Приложение по url / должно отдавать код клиентского js.
Необходимо реализовать приложение - тонкий клиент (исполняемое в браузере) с использованием стандартного JS или любого популярного программного каркаса Vue.js, Angular, React и т.п..
Требуется реализовать методы перечисления файлов и папок по передаваемому пути, удаленное скачивание файлов.

По желанию список может быть расширен заливкой/удалением файлов, создание и удаление пустых папок и т.п. - оценивается дополнительно в 1 балл (максимум 6).

Для успешной сдачи необходимо предоставить текстовое описание протокола. */
const express = require("express");
const fs = require("fs");
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
            console.log("Файл удалён");
            res.send("Файл удалён2");
        }
    });
});
app.delete("/api/folder/delete/:filename(*)", function(req, res){
    let filename = "FilesLab/" + req.params.filename;
    fs.rmdir(filename, err => {
        if(err) throw err; // не удалось удалить папку
        console.log('Папка успешно удалена');
        res.send("папка удалена2");
    });
});
app.get('/api/file/download/:file(*)', (req, res) => {
    let file = req.params.file;
    let fileLocation = path.join('./FilesLab', file);

    console.log(fileLocation);
    res.download(fileLocation);
    //res.download('./FilesLab', 'file123.txt');
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
app.get("/api/users", function(req, res){
       
    const content = fs.readFileSync(filePath2,"utf8");
    const users = JSON.parse(content);
    res.send(users);
});
// получение одного пользователя по id
app.get("/api/users/:id", function(req, res){
       
    const id = req.params.id; // получаем id
    const content = fs.readFileSync(filePath2, "utf8");
    const users = JSON.parse(content);
    let user = null;
    // находим в массиве пользователя по id
    for(var i=0; i<users.length; i++){
        if(users[i].id==id){
            user = users[i];
            break;
        }
    }
    // отправляем пользователя
    if(user){
        res.send(user);
    }
    else{
        res.status(404).send();
    }
});
// получение отправленных данных
app.post("/api/users", jsonParser, function (req, res) {
      
    if(!req.body) return res.sendStatus(400);
      
    const userName = req.body.name;
    const userAge = req.body.age;
    let user = {name: userName, age: userAge};
      
    let data = fs.readFileSync(filePath2, "utf8");
    let users = JSON.parse(data);
      
    // находим максимальный id
    const id = Math.max.apply(Math,users.map(function(o){return o.id;}))
    // увеличиваем его на единицу
    user.id = id+1;
    // добавляем пользователя в массив
    users.push(user);
    data = JSON.stringify(users);
    // перезаписываем файл с новыми данными
    fs.writeFileSync("users.json", data);
    res.send(user);
});
 // удаление пользователя по id
app.delete("/api/users/:id", function(req, res){
       
    const id = req.params.id;
    let data = fs.readFileSync(filePath2, "utf8");
    let users = JSON.parse(data);
    let index = -1;
    // находим индекс пользователя в массиве
    for(var i=0; i < users.length; i++){
        if(users[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        // удаляем пользователя из массива по индексу
        const user = users.splice(index, 1)[0];
        data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        // отправляем удаленного пользователя
        res.send(user);
    }
    else{
        res.status(404).send();
    }
});
// изменение пользователя
app.put("/api/users", jsonParser, function(req, res){
       
    if(!req.body) return res.sendStatus(400);
      
    const userId = req.body.id;
    const userName = req.body.name;
    const userAge = req.body.age;
      
    let data = fs.readFileSync(filePath2, "utf8");
    const users = JSON.parse(data);
    let user;
    for(var i=0; i<users.length; i++){
        if(users[i].id==userId){
            user = users[i];
            break;
        }
    }
    // изменяем данные у пользователя
    if(user){
        user.age = userAge;
        user.name = userName;
        data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        res.send(user);
    }
    else{
        res.status(404).send(user);
    }
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