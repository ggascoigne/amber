#Schema changes

Tracking schema changes in the V1 ACNW database.

Files:

Schema files matching the V1 mysql database at the time of project start

* schema_export_12302017.sql - raw mysql schema
* schema_12302017.js - unedited knex file generated from schema_export_12302017.sql

File matching mysql state at 08092018

* schema_export_08092018.sql
* schema_08092018.js - unedited knex file generated from schema_export_08092018.sql

Diffing these files gives an easy way to track the results of the dynamic schema changes managed in the grails app.
