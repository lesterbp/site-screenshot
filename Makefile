include .env
export

MIGRATE = ./node_modules/db-migrate/bin/db-migrate

start:
	docker-compose up

unitTest:
	docker-compose run --rm node-chromium sh -c "npm test"

shell:
	docker-compose run --rm node-chromium sh

migrateUp:
	${MIGRATE} up

migrateDown:
	${MIGRATE} down

migrateCreate:
	${MIGRATE} create ${MIGRATION_NAME}

deps:
	npm install
	make migrateUp