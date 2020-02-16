# Import .env file
include .project.env
include .user.env

# set binary
docker-compose = docker-compose -f docker/stacks/base/docker-compose.yml -f docker/stacks/local/docker-compose.yml -p $(PROJECT_NAME)
php = $(docker-compose) run --rm -u $(USER_NAME):$(USER_NAME) php php
composer = $(php) -d memory_limit=-1 /usr/local/bin/composer
drush = $(php) -d memory_limit=-1 vendor/bin/drush
console = $(php) -d memory_limit=-1 vendor/bin/drupal
behat = $(php) -d memory_limit=-1 vendor/bin/behat --config tests/behat/behat.yml
blackfire = $(docker-compose) run --rm blackfire blackfire
node = $(docker-compose) run --rm node
npm = $(docker-compose) run --rm node npm
ip = $$(docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${PROJECT_NAME}_httpd_1)

.DEFAULT_GOAL := help
.PHONY: help install-from-database install-from-scratch uninstall reinstall-from-database reinstall-from-scratch up stop ps logs ips go build php dependencies clean composer drush console bootstrap-database import-db update-db-configuration assets tests blackfire security-checker coding_standard fix_coding_standard

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sed -e 's/Makefile://' -e 's/:/##/g'  | awk 'BEGIN {FS = "##"}; {printf "\033[36m%-30s\033[0m %-30s %s\n", $$1, $$3,$$4}'


install-from-database: build dependencies up import-db update-db-configuration assets install-react build-react ips ## ## Install project with database

install-from-scratch: build dependencies up bootstrap-database assets install-react build-react ips ## ## Install project from scratch

uninstall: clean ## ## Uninstall project
	$(docker-compose) down --remove-orphans -v

reinstall-from-database: uninstall install-from-database ## ## Reinstall existing project from database

reinstall-from-scratch: uninstall install-from-scratch ## ## Reinstall existing project from scratch

up: ## [container=] ## (Re-)Create and start containers
	$(docker-compose) up -d --remove-orphans
	$(MAKE) ips

stop: ## [container=] ## Stop containers
	$(docker-compose) stop $(container)
	-@./docker/host/edit-host.sh remove $(ip) ${PROJECT_NAME}.local

ps: ## [container=] ## List containers status
	$(docker-compose) ps $(container)

logs: ## [container=] ## Show containers logs
	$(docker-compose) logs -f $(container)

ips: ## ## Show containers IP
	@for CONTAINER in $$(make -s ps |awk {'print $$1'} | awk 'NR > 2'); do echo "$$CONTAINER\t" $$(docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $$CONTAINER); done | column -t
	-@./docker/host/edit-host.sh remove $(ip) ${PROJECT_NAME}.local
	-@./docker/host/edit-host.sh add $(ip) ${PROJECT_NAME}.local

go: ## container= [user=root] ## Start container terminal
	docker exec -ti -u $(or $(user), root) $(PROJECT_NAME)_$(container)_1 /bin/bash

build: ## [container=] ## Build docker images
	docker-compose -f docker/stacks/base/docker-compose-build.yml -f docker/stacks/local/docker-compose-build.yml -p $(PROJECT_NAME) build $(container)

build-sources: ## CI_COMMIT_REF_NAME= ## Build docker source image
	docker-compose -f docker/stacks/base/docker-compose-build.yml -f docker/stacks/sources/docker-compose-build.yml -p ${PROJECT_NAME} build

install-react: ## ## Install NPM APP REACT dependencies
	$(npm) install --prefix ./src/App/
	@chmod 777 custom/themes/theme_front_master/src/App/rename_dist.sh

build-react: ## ## Build / Rebuild NPM APP REACT
	$(npm) run-script build --prefix ./src/App/

php: ## [CMD=-v] ## Launch PHP command
	$(php) ${or ${CMD}, -v}

composer: ## [CMD=] ## Launch composer command
	$(composer) ${CMD}

drush: ## [CMD=] ## Launch drush command
	$(drush) ${CMD}

console: ## [CMD=] ## Launch console command
	$(console) ${CMD}

dependencies: vendor ## ## Install project dependencies

vendor: composer.json
	$(composer) install

clean: ## ## Remove project dependencies
	@sudo rm -rf drupal/ vendor/

update-db-configuration: ## ## Update database configuration
	$(drush) cr
	$(drush) updb --entity-updates -y
	$(drush) cim -y
	$(drush) cr

bootstrap-database: ## ## Create database schema from scratch
	$(drush) si -y --site-name=${PROJECT_NAME} --account-pass=admin config_installer
	$(drush) cim -y

tests: coding_standard behat blackfire security-checker ## ## Execute all tests

coding_standard:
	$(php) vendor/bin/phpcs --runtime-set installed_paths drupal/modules/contrib/coder/coder_sniffer --standard=Drupal --ignore=custom/sites/default/files --extensions=php,module,inc,install,test,profile,theme,css,info,txt,md custom/
	$(php) vendor/bin/phpcs --runtime-set installed_paths drupal/modules/contrib/coder/coder_sniffer --standard=DrupalPractice --ignore=custom/sites/default/files --extensions=php,module,inc,install,test,profile,theme,css,info,txt,md custom/

fix_coding_standard: ## ## Fix Drupal Coding Standard
	$(php) vendor/bin/phpcbf --runtime-set installed_paths drupal/modules/contrib/coder/coder_sniffer --standard=Drupal --ignore=custom/sites/default/files --extensions=php,module,inc,install,test,profile,theme,css,info,txt,md custom/
	$(php) vendor/bin/phpcbf --runtime-set installed_paths drupal/modules/contrib/coder/coder_sniffer --standard=DrupalPractice --ignore=custom/sites/default/files --extensions=php,module,inc,install,test,profile,theme,css,info,txt,md custom/

assets: gulp ## ## Generate assets

gulp: ## [CMD=] ## Execute gulp
	$(node) static-builder/node_modules/.bin/gulp --cwd=static-builder/ $(filter-out $@,${CMD})

blackfire: ## [CMD=curl httpd] ## Launch blackfire command
	$(blackfire) ${or ${CMD}, curl httpd}

security-checker: ## [CMD=security:check composer.lock] ## Launch security-checker command
	$(php) -d memory_limit=-1 vendor/bin/security-checker ${or ${CMD}, security:check composer.lock}

behat: ## [CMD=] ## Launch behat command
	$(behat) ${CMD}

import-db: up ## ## Import database dump
	@for f in docker/mysql/initdb/* ; do \
		echo Importing $$f in database ; \
		case "$$f" in \
			*.sql) cat "$$f" | $(docker-compose) exec -T mysql bash -c 'mysql --password="$$MYSQL_ROOT_PASSWORD" "$$MYSQL_DATABASE"' ;; \
			*.sql.gz) cat "$$f" | gunzip | $(docker-compose) exec -T mysql bash -c 'mysql --password="$$MYSQL_ROOT_PASSWORD" "$$MYSQL_DATABASE"' ;; \
		esac \
	done
