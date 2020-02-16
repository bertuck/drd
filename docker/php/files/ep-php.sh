#!/bin/bash

function _echo()
{
        [ "${DEBUG}" == "true" ] && echo "$@"
}

# Global config
# + Errorlog so stderr
sed -i -e '/^error_log/s,/var/log/php-fpm/error.log,/proc/1/fd/2,'  /etc/php-fpm.conf

# Test d'existance du user défini par "USER_NAME" / "USER_UID"
# Si ces variables existent, on est dans une surcouche de dev
# --> identité = USER_NAME / USER_NAME
# Sinon, on est en mode "classique" 
# --> identité = WEB_USERNAME / WEB_GROUPNAME hérité du Dockerfile
if grep -q "^${USER_NAME}:x:" /etc/passwd; then
	WEB_USERNAME=${USER_NAME}
	WEB_GROUPNAME=$(id -gn ${WEB_USERNAME})
	echo "DEV USER:${WEB_USERNAME} (GROUP:${WEB_GROUPNAME})"
fi

# Create dirs here (and not in Dockerfile) to fit to --user 
install -d -o ${WEB_USERNAME} -g ${WEB_GROUPNAME} -m 750 /var/log/php /var/lib/php/fpm{,/session,/wsdlcache,/opcache} /run/php-fpm

# TUNING (CLI + PHP-FPM)
set | grep "^PHP__" | while read L ; do
 echo "${L#PHP__}" | sed -e 's,_dot_,.,' -e 's,=, = ,' 
done > /tmp/99-tuning.ini

# Apply PHP config
mv /tmp/99-tuning.ini /etc/php.d/99-tuning.ini

_echo -e "TUNING PHP-CLI :" :
[ "${DEBUG}" == true ] && cat /etc/php.d/99-tuning.ini

# TUNING POOL PHP-FPM
_echo -e "\n==============="
_echo -e "Tuning PHP-FPM:"
_echo -e "==============="
_echo -e "** PM_MODE : ${PM_MODE:=ondemand}"
_echo -e "** PM_MAX_CHILDREN : ${PM_MAX_CHILDREN:=10}"
_echo -e "** PM_MAX_REQUESTS : ${PM_MAX_REQUESTS:=500}"
_echo -e "** PM_PROCESS_IDLE_TIMEOUT : ${PM_PROCESS_IDLE_TIMEOUT:=30s}"
_echo -e "======================================="

sed -i \
    -e "/^user =/s,WEB_USERNAME,${WEB_USERNAME}," \
    -e "/^group =/s,WEB_GROUPNAME,${WEB_GROUPNAME}," \
    -e "s,PM_MODE,${PM_MODE}," \
    -e "s,PM_MAX_CHILDREN,${PM_MAX_CHILDREN}," \
    -e "s,PM_PROCESS_IDLE_TIMEOUT,${PM_PROCESS_IDLE_TIMEOUT}," \
    -e "s,PM_MAX_REQUESTS,${PM_MAX_REQUESTS}," \
    ${PHPFPM_POOL_CONFIG}

# Tuning des processus uniquement si MODE = dynamic
if [ "${PM_MODE}" == "dynamic" ] ; then
  _echo -e "** PM_START_SERVERS : ${PM_START_SERVERS:=2}"
  _echo -e "** PM_MIN_SPARE_SERVERS : ${PM_MIN_SPARE_SERVERS:=2}"
  _echo -e "** PM_MAX_SPARE_SERVERS : ${PM_MAX_SPARE_SERVERS:=5}"
else
  PM_START_SERVERS=0
  PM_MIN_SPARE_SERVERS=0
  PM_MAX_SPARE_SERVERS=0
fi
sed -i \
    -e "s,PM_START_SERVERS,${PM_START_SERVERS}," \
    -e "s,PM_MIN_SPARE_SERVERS,${PM_MIN_SPARE_SERVERS}," \
    -e "s,PM_MAX_SPARE_SERVERS,${PM_MAX_SPARE_SERVERS}," \
    ${PHPFPM_POOL_CONFIG}

_echo -e "\nPHP-FPM pool config : (${PHPFPM_POOL_CONFIG})"
[ "${DEBUG}" == true ] && grep -vE '^;|^ *$' ${PHPFPM_POOL_CONFIG}

