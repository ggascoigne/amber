# Database Test

* config from [node-config](https://github.com/lorenwest/node-config)
* database from [sequilize](http://docs.sequelizejs.com/)
* [manual migration](http://docs.sequelizejs.com/manual/tutorial/migrations.html)
* [programatic migration](https://github.com/sequelize/umzug) - unused



## Setup

```bash
$ NODE_ENV=development node node_modules/.bin/sequelize db:migrate
```

# Knex.js version

After becoming dissatisfied with the state of the documentation with Sequelize 
V4, all the docs only refer to V3, and the migration stuff is all  V3 specific. 
I've decided to look at Knex

* [Knex.js](http://knexjs.org)
* [Bookshelf.js](http://bookshelfjs.org/)

https://labs.mlssoccer.com/how-to-be-a-hapi-developer-8bb844b3d6a

# Moving to Postgres

Looks like I can [pgloader](https://github.com/dimitri/pgloader) to pretty easily migrate everything from 
MySql to Postgres

Perhaps something like this as a workflow:

1. Copy the database from live to a local mysql temporary clone
1. Use pgloader to convert all the data over to a temp postgres clone
1. Create the target database
1. create the knex records since the knex-migrate fails to initialize things correctly
1. Create an acnw1 compatible schema using a knex migrator
1. Import the data by copying it from the temp postgres clone into the target database
1. run the rest of the migrators converting the data over toacnw2 format

Much of this is very similar to the existing importV1ToLocal script, but targetting postgres rather then MySql.
