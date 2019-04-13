# Spinral Exam - Fullstack

## Backend
- Node NestJS Framework - https://nestjs.com/
- PostgreSQL
- API Docs - see api-docs.pdf in root folder for documentation

## Frontend
- AngularJS - https://angular.io/
- Material Angular - https://material.angular.io/
- Features
    - Register - http://localhost:4200/registration
    - Login - http://localhost:4200/login
    - Users - http://localhost:4200/admin/user
        - Filter
        - Sorting
        - Pagination
        - Delete

## Setup
- Install PostgresSQL and Create Database
- Set DB Configuration
```bash
# main database configuration
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=SkywalkerTools
export DB_USERNAME=db_username
export DBE_PASSWORD=db_password

```

## Run API and Web Locallly
```bash
# API
$ cd api
$ npm run start

# Web
$ cd web
$ ng serve
```

## Run API and Web using Docker

```bash
# install docker 

# run docker command to build app
docker-compose build .

# run docker command to run
docker-compose up

# run docker command to stop
docker-compose down
```
