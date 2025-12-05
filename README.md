# User Management API with File Upload

This project is a RESTful API built with **Node.js**, **Express**, and **MySQL**. It allows you to manage users with profile pictures and supports CRUD operations.

---

## Features

- Connects to MySQL database using `mysql2/promise`
- CRUD operations for users:
  - Create a user with name, gender, date of birth, and profile picture
  - Read all users or a specific user by ID
  - Update user details and profile picture
  - Delete a user
- File upload support for profile pictures using **Multer**
- CORS enabled
- Static file serving for uploaded files

---

## Technologies Used

- Node.js
- Express.js
- MySQL
- Multer
- CORS

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ranntharath/crud-express-mysql.git
cd cd crud-express-mysql

```
2. Install dependencies:

```base
npm install
```

3. Create Database Mysql
```bash
CREATE DATABASE db_start;

USE db_start;

CREATE TABLE tb_people (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    profile VARCHAR(255)
);
```

4. Run the server
```bash
npm run dev
```
- [Usage](#usage)  
- [API Endpoints](#api-endpoints)  
  - [GET /api](#get-api)  
  - [GET /api/users](#get-apiusers)  
  - [GET /api/users/:id](#get-apiusersid)  
  - [POST /api/users](#post-apiusers)  
  - [PUT /api/users/:id](#put-apiusersid)  
  - [DELETE /api/users/:id](#delete-apiusersid)  
- [File Upload](#file-upload)  
