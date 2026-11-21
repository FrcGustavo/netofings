.DEFAULT_GOAL := build
COMPOSE ?= docker compose -f ../../docker-compose.yml
.PHONY: install build lint test dev up agent-build

install:
	$(MAKE) -C ../../clients/agent install
	npm ci

agent-build:
	$(MAKE) -C ../../clients/agent build

build: agent-build
	npm run build

dev: build
	npm run start -- $(ARGS)

up:
	$(COMPOSE) run --build --rm cli $(ARGS)

lint test:
	npm run $@
