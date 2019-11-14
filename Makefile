include .env
export

MIGRATE = ./node_modules/db-migrate/bin/db-migrate

start:
	docker-compose up

stop:
	docker-compose down

test:
	docker-compose run --rm node-chromium sh -c "make _lint && make _unitTest"

shell:
	docker-compose run --rm node-chromium-db sh

_lint:
	npm run linter"

_unitTest:
	docker-compose run --rm node-chromium sh -c "npm test"

_migrateUp:
	${MIGRATE} up

_migrateDown:
	${MIGRATE} down

_migrateCreate:
	${MIGRATE} create ${MIGRATION_NAME}

_deps:
	npm install
	sleep 20
	make _migrateUp