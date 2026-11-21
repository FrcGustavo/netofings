.DEFAULT_GOAL := build
COMPOSE ?= docker compose -f ../../docker-compose.yml
.PHONY: install build lint example up

install:
	npm ci

build lint example:
	npm run $@

up:
	$(COMPOSE) run --build --rm agent-example
