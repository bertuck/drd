### PHP via packages IUS / CentOS 7
ARG CENTOS_VERSION
FROM centos:7
ARG PHPVERSION

RUN echo -e "Building PHP $PHPVERSION on $(cat /etc/centos-release)"

# Spécifiques à cet image
LABEL Vendor="Actilis" \
      Maintainer="Francois MICAUX <dok-images@actilis.net>" \
      License=GPLv3

# ===============================================
# Layer de base
# à reprendre par toutes les images pour mutualisation
RUN set -eux \
 && yum -y install epel-release \
 && yum -y install https://rpms.remirepo.net/enterprise/remi-release-7.rpm \
 && yum -y install ca-certificates ssmtp \
 && yum clean all && rm -rf /var/cache/yum

ARG USER_UID
ARG USER_NAME

ENV WEB_USERNAME ${USER_NAME}
ENV WEB_GROUPNAME ${USER_NAME}

RUN groupadd -g ${USER_UID} ${USER_NAME}
RUN useradd -g ${USER_UID} ${USER_NAME} || echo "User already exists."
USER 'root'

# Add PHP common extensions : see embeded script
COPY files/install-php-ext.sh  /usr/local/bin/install-php-deps.sh
RUN set -eux \
 && /usr/local/bin/install-php-deps.sh

# ===============================================
# Install Composer
COPY files/install-composer.sh  /usr/local/bin/install-composer.sh
RUN set -eux \
 && /usr/local/bin/install-composer.sh

# ==========================================
RUN mkdir -p -m 755 /ep.d
COPY files/ep-system.sh /ep.d/00-system.sh
COPY files/ep-php.sh    /ep.d/01-php.sh
COPY files/ep.sh        /ep.sh

# env vars nécessaires pour les scripts d'EP
ENV PHPFPM_POOL_CONFIG /etc/php-fpm.d/www.conf

## Données à importer (ADD, COPY,...)
COPY files/phpfpm-pool-www.conf    ${PHPFPM_POOL_CONFIG}

# Manage permisisons, clean...
RUN chmod -R 755 /ep.sh /ep.d/ /etc/php-fpm.d/www.conf
RUN chown ${USER_NAME}:${USER_NAME} /usr/bin/php /usr/local/bin/composer
## Ports
EXPOSE 9000

# Déclaration après le peuplement sinon : données invisibles dans les surcouches

## Entrypoint calls all scripts in /ep.d/*.sh (they apply the configuration at statup)
ENTRYPOINT ["/ep.sh"]
## At the end, ep.sh does "exec $@" (CMD)
CMD ["/usr/sbin/php-fpm", "-F"]

# Test de vie
HEALTHCHECK --interval=5s --timeout=2s --retries=3 CMD /usr/bin/php /var/www/html/.alive.php | grep -q ^OK
COPY files/alive.php /var/www/html/.alive.php

## Default dir for apps
WORKDIR /var/www/html

ENV LANG=fr_FR.UTF-8
RUN localedef -i fr_FR -f UTF-8 fr_FR.UTF-8 \
 && localedef -i en_US -f UTF-8 en_US.UTF-8
