# WDPS - Web Document Protocol System

Simple Spring Boot application with dry REST API, JWT authentication
and documents CRUD client with Angular JS and Bootstrap.

Tested on Google Chrome 87.0.4280.88 on Fedora 33 (Workstation Edition) 64-bit.

## Dependencies

| Feature           | Version |
|-------------------|---------|
| Java              | 1.8     |
| Apache Maven      | 3.6.3   |
| Spring Boot       | 2.5.0   |
| Spring Data REST  |         |
| Spring Security   |         |
| JWT               |         |
| Postgre SQL       |         |
| Angular JS        |         |
| Twitter Bootstrap | 4.5     |
| HTML              | 5       |
| CSS               | 3       |
| JavaScript        | 2015+   |

## Rest API backend

Backend using Spring Data REST
Spring Security with JWT token

GET /api

GET /api/profile

GET /api/document{?page=0&size=10&sort=id,asc}

POST /api/document

GET /api/document/:id

PUT /api/document/:id

DELETE /api/document/:id

POST /login

...

## Application frontend

Single page layout with Angular JS and Bootstrap

* Login form
* Data grid
* Document editor

## Testing

Backend test units

```sh
mvn test
```

## Configuring

Edit application.properties to change database settings

```properties
# Postgre SQL
spring.datasource.driver = org.postgresql.Driver
spring.datasource.url = jdbc:postgresql://127.0.0.1:5432/mydb
spring.datasource.username = ****
spring.datasource.password = ****

# hsqldb
...
```

## Running

Starting server with maven

```sh
mvn spring-boot:run
```
