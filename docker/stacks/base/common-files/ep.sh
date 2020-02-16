#!/bin/bash

# Set Locale
export LANG=${LANG:-fr_FR.UTF-8}
export LANGUAGE=${LANG}
export LC_ALL=${LANG}
echo LANG="${LANG}" > /etc/locale.conf

# Set Timezone
export TZ=${TIMEZONE:-Europe/Paris}
# System
ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Tuning ldap.conf
sed -i -e "\$a\
TLS_REQCERT      ${LDAP_TLS_REQCERT:-never}" /etc/openldap/ldap.conf

# Préparation Supervisord
mkdir -p /etc/supervisord.d

echo "
[supervisord]
user=root
pidfile=/var/run/supervisord.pid
logfile=/var/log/supervisord.log
loglevel=info
nodaemon=true

[include]
files = /etc/supervisord.d/*.ini
" > /etc/supervisord.conf

# Preparation HTTPD + HTTPD + ... whatever the app adds
for S in /ep.d/*.sh
do
    $S
done

# = Fix owner of web-content
[ "${FIX_WEBCNONTENT_OWNER}" == "true" ] && chown -R ${USER_NAME}:${USER_NAME} /var/www/html

# ========================== Main process =========================
[ "${DEBUG}" == "true" ] && echo -e "\n[42m[30m[1mLancement du processus d'avant plan : $@[0m\n\n" 

exec "$@"
