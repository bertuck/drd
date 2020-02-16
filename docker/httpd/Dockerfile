ARG BASE_IMAGE
FROM centos:7.7.1908

RUN echo -e "Building HTTPD Image on $(cat /etc/centos-release)"

# Spécifiques à cet image
LABEL Vendor="Actilis" \
      Maintainer="Francois MICAUX <dok-images@actilis.net>" \
      License=GPLv3

# ===============================================
# Layer de base
# à reprendre par toutes les images pour mutualisation
RUN set -eux \
 && yum -y install epel-release https://centos7.iuscommunity.org/ius-release.rpm \
 && yum clean all && rm -rf /var/cache/yum


# Add HTTPD
# Installation Apache (+ Supervisor)
RUN set -eux \
 && yum -y install supervisor \
                   httpd24u \
 && yum clean all && rm -rf /var/cache/yum

# ==========================================
# env vars nécessaires pour les scripts d'EP
ENV HTTPD_ENABLE_PHPFPM_INET false
ENV PHPFPM_HOST phpfpm
ENV PHPFPM_PORT 9000

# fichiers à importer (ADD, COPY,...)
COPY common-files/httpd-logs.conf      /etc/httpd/conf.d/httpd-logs.conf
COPY common-files/httpd-fastcgi.conf   /etc/httpd/conf.d/httpd-fastcgi.conf
COPY common-files/httpd-vhost.conf     /etc/httpd/conf.d/vhost.conf

RUN mkdir -p /ep.d
COPY common-files/ep.sh          /ep.sh
COPY files/ep-httpd.sh           /ep.d/00-httpd.sh

ARG USER_NAME
ARG USER_UID
ENV WEB_USERNAME ${USER_NAME}
ENV WEB_GROUPNAME ${USER_NAME}

RUN groupadd -g ${USER_UID} ${USER_NAME}
RUN useradd -g ${USER_UID} ${USER_NAME} || echo "User already exists."

# Manage permisisons, user, group, clean...
RUN chmod -R 755 /ep.sh /ep.d/

RUN set -eux \
 && rm -f /etc/httpd/conf.d/welcome.conf \
 && mkdir -p /var/www/html \
 && echo -e "Options +Indexes" > /var/www/html/.htaccess \
 && chmod o+x /var /var/www \
 && chown -R ${WEB_USERNAME}:${WEB_GROUPNAME} /var/www/html \
 && chmod -R 755 /var/www/html

## Ports
EXPOSE 80

# Si APP doit mettre à jour des data persistantes dans /var/www/html,
# Ajouter ce volume dans le Dockerfile de l'APPLI
# VOLUME /var/www/html
VOLUME /httpdlogs

## Entrypoint calls all scripts in /ep.d/*.sh (they apply the configuration at statup)
ENTRYPOINT ["/ep.sh"]
## At the end, ep.sh does "exec $@" (CMD)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]

# Test de vie
HEALTHCHECK --interval=5s --timeout=2s --retries=3 CMD curl -s --fail http://localhost/.alive.php | grep -q ^OK
COPY files/alive.php /var/www/html/.alive.php

## Default dir for apps
WORKDIR /var/www/html

ENV LANG=fr_FR.UTF-8
RUN localedef -i fr_FR -f UTF-8 fr_FR.UTF-8 \
 && localedef -i en_US -f UTF-8 en_US.UTF-8
