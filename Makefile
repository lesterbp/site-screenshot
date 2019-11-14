include .env
export

start:
	docker-compose run --rm node sh -c "npm start"

unitTest:
	docker-compose run --rm node sh -c "npm test"

shell:
	docker-compose run --rm node sh
