ARG REGISTRY
ARG APP_NAMESPACE
ARG BRANCH


# Build sources Node FROM base node image
FROM ${REGISTRY}/${APP_NAMESPACE}/node-base:${BRANCH} as build-node
## Copy package.json file and dev files asset
COPY ./custom/themes/theme_front_master ./

## Install NPM Dependencies
RUN npm install -s --prefix ./static-builder
## Run gulp for build assets
RUN node ./static-builder/node_modules/.bin/gulp --cwd=static-builder/

## Install APP NPM Dependencies
RUN chmod 777 ./src/App/rename_dist.sh
RUN npm install -s --prefix ./src/App/
## Run gulp for build assets
RUN npm run-script build --prefix ./src/App/

# Build sources PHP FROM base php image
FROM ${REGISTRY}/${APP_NAMESPACE}/php-base:${BRANCH} as build-php
## Copy composer file
COPY ./composer.json ./composer.json
COPY ./composer.lock ./composer.lock
## Copy custom Drupal files from build-node stage
COPY ./custom ./custom
COPY --from=build-node /usr/src/app ./custom/themes/theme_front_master
## Remove some dev files
RUN rm -rf ./custom/themes/theme_front_master/static-builder/
## Install PHP Dependencies
RUN php -d memory_limit=-1 /usr/local/bin/composer --no-interaction install --no-progress --no-suggest --no-dev --optimize-autoloader --prefer-dist
## Composer scripts
RUN php -d memory_limit=-1 /usr/local/bin/composer --no-interaction run-script copy-custom


# Merge build sources FROM scratch
FROM scratch as sources

COPY --from=build-php /var/www/html/vendor /var/www/html/vendor
COPY --from=build-php /var/www/html/drupal /var/www/html/drupal
COPY --from=build-php /var/www/html/composer.json /var/www/html/composer.json
