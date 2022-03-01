
# <p  align="center">Shoutbox</p>


![shoutbox](https://raw.githubusercontent.com/samavati/shoutbox-client/main/doc/app-screen-shot.png)

You can see [live demo here](http://185.202.113.68/)

  

## Installation

  

```bash

$ npm install

```

  

## Running the app

  

```bash

# development

$ npm run start

  

# watch mode

$ npm run start:dev

  

# production mode

$ npm run start:prod

```
### Configure app

If you want to run and test this application on your local system you need to customize:

- **Running Port**: in `src/main.ts` you can find `app.listen(process.env.PORT || 80);` and change 80 with your desired port.
- **DB Config**: in this app [typeorm](https://typeorm.io/#/) is used to manage database Object–relational mapping and you can customize it's configuration in `ormconfig.json`(which you can find at the root of project).

    {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "root,
    "database": "db-name",
    "entities": [
    "dist/**/*.entity{.ts,.js}"
    ],
    "synchronize": true
    }
you can change host address, db username and db password and ... in this file.

## Languages & tools

- [TypeScript](https://www.typescriptlang.org/).
- [NestJS](https://nestjs.com/)  A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- [TypeORM](https://typeorm.io/#/) handling database stuff.