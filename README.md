# LabLang2

Задание 2 - написать на языке JS серверное (node.js) и клиентское веб приложение реализующее json API методы для доступа к файловой системе.

# micro-backdoor

Для запуска приложения:

``
    npm install
``

``
    node app.js
``

## Описание API

### Загрузить файл  

**URL** : `/api/file/*`

**Method** : `POST`

**Data constraints**

```json
{
    "file": "file"
}
```

#### Success Response: `Code: 200`

Создается файл по пути *

---

### Создать папку с именем

**URL** : `/api/folder/create/:filename(*)`

**Method** : `GET`

#### Success Response: `созданная папка с именем {filename}`

---

### Удалить папку с именем

**URL** : `/api/folder/delete/:filename(*)`

**Method** : `DELETE`

#### Success Response: `удаленная папка с именем {filename}`

---

### Скачать файл  

**URL** : `/api/file/download/:file(*)`

**Method** : `GET`

#### Success Response: `скачанный файл по адресу {file}`

---

### Удалить файл  

**URL** : `/api/file/delete/:filename(*)`

**Method** : `DELETE`

#### Success Response: `удаленный файл по адресу {file}`

---

### Просмотр папки на сервере

**URL** : `/api/folder/count`

**Method** : `GET`

#### Success Response: `список файлов`
