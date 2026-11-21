.DEFAULT_GOAL := build
COMPOSE ?= docker compose -f ../../docker-compose.yml
.PHONY: install build lint test dev up migrations-run

install:
	npm ci

build lint:
	npm run $@

test:
	npm run test -- --runInBand

dev:
	npm run start:dev

up:
	$(COMPOSE) up --detach --build --wait backend

migrations-run:
	$(COMPOSE) run --build --rm migrate
