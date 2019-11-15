# site-screenshot

A service that could take screenshots of web-pages given an input URL.
The project uses Node.js, Chromium and Postgresql.

# requirements
- Makefile: This project utilizes makefile to shorten the commands you need, it might be optional but highly recommended to be installed
- Docker: The whole project runs using docker containers

# before running the app
the application gets the needed environment variables from `.env` file
you may copy the `.env.example` and rename it as `.env` then fill up the variables

# running the app
running the app also installs node dependencies and starts the database (and creates the tables)

if you have Makefile installed
- `make start`
- otherwise: `docker-compose up`

# stopping the app
once started terminating the process via ^c (ctrl + c) should be enough but if for some reason that the containers are still running you may try these commands

if you have Makefile installed
- `make stop`
- otherwise: `docker-compose down`

# running the tests
the tests includes linting your codes and running unit test

if you have Makefile installed
- `make test`
- otherwise: `docker-compose run --rm node-chromium sh -c "make _lint && make _unitTest"`

# running shell inside a container
maybe you need something to debug and wanted to be in a shell inside the container

if you have Makefile installed
- `make shell`
- otherwise: `docker-compose run --rm node-chromium-db sh`

# using the API
<TODO>

# other notes
<TODO>
