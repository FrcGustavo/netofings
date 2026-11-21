COMPOSE ?= docker compose -f docker-compose.yml
IMAGE ?= netofings

.DEFAULT_GOAL := help
.PHONY: help install build lint test frontend backend cli agent-example config up stop down ps logs image

help:
	@printf '%s\n' \
		'Install and check:  make install build lint test' \
		'Docker environment: make up | stop | down | ps | logs | config' \
		'Individual units:   make frontend | backend | cli | agent-example' \
		'Production image:  make image [IMAGE=netofings]'

install build:
	$(MAKE) -C services/backend $@
	$(MAKE) -C apps/frontend $@
	$(MAKE) -C apps/cli $@

lint:
	$(MAKE) -C clients/agent lint
	$(MAKE) -C services/backend lint
	$(MAKE) -C apps/frontend lint
	$(MAKE) -C apps/cli lint

test:
	$(MAKE) -C services/backend test
	$(MAKE) -C apps/cli test

frontend:
	$(COMPOSE) up --detach --build --wait frontend

backend:
	$(COMPOSE) up --detach --build --wait backend

cli:
	$(COMPOSE) run --build --rm cli $(ARGS)

agent-example:
	$(COMPOSE) run --build --rm agent-example

config:
	$(COMPOSE) config --quiet

up: config
	$(COMPOSE) up --detach --build --wait

stop:
	$(COMPOSE) stop

down:
	$(COMPOSE) down

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs --follow

image:
	docker build -f services/backend/Dockerfile -t "$(IMAGE)" .
