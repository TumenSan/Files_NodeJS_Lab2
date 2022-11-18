// Файл
async function CreateFile(name, format) {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/file/create/" + name + '.' + format, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const files = await response;
        console.log(files);
    }
}
async function CreateFolder(name) {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/folder/create/" + name, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const files = await response;
        console.log(files);
    }
}
/*
// Получение всех файлов
async function GetFiles() {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/folder/count", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const files = await response.json();
        console.log(files);
        //let rows = document.querySelector("tbody"); 
        files.forEach(file => {
            let liLast = document.createElement('li');
            liLast.innerHTML = file;
            ul1.append(liLast);
            // добавляем полученные элементы в таблицу
            //rows.append(row(files));
        });
    }
}
*/
// Получение всех файлов
async function GetFiles() {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/folder/count", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const files = await response.json();
        let rows = document.querySelector("tbody"); 
        files.forEach(file => {
            // добавляем полученные элементы в таблицу
            rows.append(row(file));
        });
    }
}
//Скачивание файлов
async function DownloadFile(name) {
    if (name.indexOf('.') == -1){
        const response = await fetch("/api/folder/download/" + name, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });
        if (response.ok === true) {
            const file = await response.json();
            console.log(file);
        }
    } else {
        const response = await fetch("/api/file/download/" + name, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });
        if (response.ok === true) {
            const file = await response.json();
            console.log(file);
        }
    }
}
//Удаление файла
async function DeleteFile(name) {
    if (name.indexOf('.') == -1){
        const response = await fetch("/api/folder/delete/" + name, {
            method: "DELETE",
            headers: { "Accept": "application/json" }
        });
        if (response.ok === true) {
            const file = await response.json();
            console.log(file);
            document.querySelector("tr[data-rowid='" + file + "']").remove();
        }
    } else {
        const response = await fetch("/api/file/delete/" + name, {
            method: "DELETE",
            headers: { "Accept": "application/json" }
        });
        if (response.ok === true) {
            const file = await response.json();
            console.log(file);
            document.querySelector("tr[data-rowid='" + file + "']").remove();
        }
    }
}

// сброс формы
function reset() {
    const form = document.forms["fileForm"];
    form.reset();
}
// создание строки для таблицы
function row(file) {

    const tr = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.append(file);
    tr.append(nameTd);
      
    const linksTd = document.createElement("td");

    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("data-id", file);
    downloadLink.setAttribute('href', 'http://localhost:3000/api/file/download/Bok.txt');
    downloadLink.setAttribute('download','download');
    downloadLink.setAttribute("style", "cursor:pointer;padding:15px;");
    downloadLink.append("Скачать");
    downloadLink.addEventListener("click", e => {

        e.preventDefault();
        DownloadFile(file);
    });

    linksTd.append(downloadLink);

    const removeLink = document.createElement("a");
    removeLink.setAttribute("data-id", file);
    removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
    removeLink.append("Удалить");
    removeLink.addEventListener("click", e => {

        e.preventDefault();
        DeleteFile(file);
    });

    linksTd.append(removeLink);

    tr.appendChild(linksTd);

    return tr;
}
// сброс значений формы
document.getElementById("reset").click(function (e) {

    e.preventDefault();
    reset();
})

// отправка формы
document.forms["fileForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["fileForm"];
    const name = form.elements["name"].value;
    const format = form.elements["format"].value;
    if ((format == '') || (format == 'folder')){
        CreateFolder(name);
    }
    else{
        CreateFile(name, format);
    }
});

// загрузка файлов
GetFiles();