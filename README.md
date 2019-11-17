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

NOTE:
- starting the app may take a while as the start script have `sleep` in it to sync with DB start process
- in case the application does not start correctly due to migration error, you might need to increase the sleep value in `Makefile`'s `_deps` target

# stopping the app
once started, terminating the process via ^c (ctrl + c) should be enough but if for some reason that the containers are still running you may try these commands

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
Doing screenshots would queue it for batch processing. It does not return screenshots in realtime but instead will give you a `batch ID` that you could use later on to check the batch process status.

## take screenshot of single url
This takes a screenshot of a single website. The value at the end of path should be URL encoded.
Sample:
```
GET: http://0.0.0.0:3001/site-screenshot/capture-screenshot/<URL_ENCODED_URL>
Sample URL Encoded URL: http%3A%2F%2Fwww.example.com
```

## take screenshot of multiple urls
This takes a screenshots of multiple websites.
Sample:
```
Content-Type: application/json
POST: http://0.0.0.0:3001/site-screenshot/capture-screenshot
```
Payload:
```
{
	"url": [
		"http://www.example1.com",
		"http://www.example2.com"
	]
}
```

## get batch via batch ID
This accepts `batchId` returned by capture screenshot requests and returns the batch's status and file (screenshots) `key` both are required in retrieving the actual image.
```
GET: http://0.0.0.0:3001/site-screenshot/batch/<batch_ID>
```

## get screenshot image
Once the batch status is `SUCCESS` then you would be able to retrieve the screenshot image.
`Batch ID` is returned upon take screenshot request, and the `file key` can be get from retrieving the batch details.
```
GET: http://0.0.0.0:3001/site-screenshot/file/<batch_ID>/<file_key>
```

# other notes
## productionization
Current project setup is not meant to be deployed to production.
Taking the project to production would at least need the following:
- proper system variable (env) configuration
- install dependencies with `NODE_ENV` value `production`
- using actual Node instead of the `node-dev`
- bundling the project (maybe using webpack)
- creating a docker image of the project snapshot and configuring start up script
- creating a separate docker image for running the batch processing (batch.js) and configuring start up script
- not including the DB with the docker image. DB should not be ran in the same image as the application. Run it separately but should only have one instance running.

## scalability
The project is created with scalability in mind, that's why the REST application and Batch are written in a way that it can be separated.
You may run the two separately using their own Docker images and use Kubernetes or AWS ECS for those to scale automatically depending on cpu and memory usage.
For the REST application it can be deployed in AWS Lambda & AWS API Gateway combination but might require a bit of code adjustment as you won't need `express.js` (the Node's REST API Server) anymore for that.
