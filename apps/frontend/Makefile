.DEFAULT_GOAL := build
COMPOSE ?= docker compose -f ../../docker-compose.yml
.PHONY: install build lint dev up

install:
	npm ci

build lint dev:
	npm run $@

up:
	$(COMPOSE) up --detach --build --wait frontend
