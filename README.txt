WELLTALE is a JavaScript Deno / HTML app for reporting and tracking of everyday lifestyle acitivities such as sleep, sports, and studying.
Initial code created in 2020 as the final project of the course Web Software Development in Aalto University.

DATABASES:

The database tables used in this application have been created using the following
SQL statements:

- appusers
CREATE TABLE appusers (id SERIAL PRIMARY KEY, email VARCHAR(100) NOT NULL, password
CHAR(60) NOT NULL);

- stats
CREATE TABLE stats (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES appusers(id) NOT NULL,
date DATE NOT NULL, type VARCHAR(20) NOT NULL, rating INTEGER, hours NUMERIC(3,1))

The file .env should be populated with appropriate database credentials for the
database functionalities to work.


ACCESS

The WellTale application can be accessed at http://localhost:<APPPORT>/ once the user has run
the application. APPPORT must be specified in .env.


RUNNING

WellTale can be run on command line in the root of the project directory with the command

deno run --allow-env --allow-read --allow-net --unstable app.js

TESTS

This version of WellTale does not contain automated tests.
