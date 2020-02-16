#!/bin/bash

echo "== Installation PHPVERSION: $PHPVERSION"

# Packages names have changed on IUS for PHP73
PHP=php
case ${PHPVERSION} in 
  7.4*) REPO=remi-php74
       ;;
  7.3*) REPO=remi-php73
       ;;
  7.2*) REPO=remi-php72
       ;;
  7.1*) REPO=remi-php71
       ;;
  5.6*) REPO=remi-php56
       ;;
  *)   echo "Erreur Version PHP" && exit 1
esac

yum-config-manager --enable ${REPO} \

# Add Base packages
set -eux \
 && yum -y install \
    ${PHP}-gd \
    ${PHP}-intl \
    ${PHP}-json \
    ${PHP}-ldap \
    ${PHP}-mbstring \
    ${PHP}-mysqlnd \
    ${PHP}-opcache \
    ${PHP}-pgsql \
    ${PHP}-soap \
    ${PHP}-xml \
    ${PHP}-cli \
    ${PHP}-common \
    ${PHP}-fpm

set -eux \
 && yum -y install \
    php-pecl-zip.x86_64

# Add Sodium (available on 7.2 only)
if [ "${PHP}" == "php72u" ]; then 
   yum -y install ${PHP}-sodium
   yum clean all && rm -rf /var/cache/yum
fi

# Clean
yum clean all && rm -rf /var/cache/yum

# Permisisons (ouverture uniquement sur surcharge USER)
chmod -R 777 /var/log/php-fpm
