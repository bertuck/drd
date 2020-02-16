#!/bin/bash

function _echo()
{
	[ "${DEBUG}" == "true" ] && echo "$@"
}

LOADMODULE_BASE_FILE=/etc/httpd/conf.modules.d/00-base.conf
LOADMODULE_CGI_FILE=/etc/httpd/conf.modules.d/01-cgi.conf
LOADMODULE_MPM_FILE=/etc/httpd/conf.modules.d/00-mpm.conf
HTTPD_CONF_FILE=/etc/httpd/conf/httpd.conf
GLOBAL_CONF_FILE=/etc/httpd/conf.d/httpd-global.conf
LOGS_CONF_FILE=/etc/httpd/conf.d/httpd-logs.conf
VHOST_CONF_FILE=/etc/httpd/conf.d/vhost.conf
DEFINES=""

## Pré-Config : logs et DocumentRoot --> /var/www/html
sed -i -e '/ErrorLog.*logs.error.log/s,logs/error.log,/proc/1/fd/2,' \
       -e '/CustomLog .*logs.access.log. combined/s,logs/access.log,/proc/1/fd/1,' \
       ${HTTPD_CONF_FILE}

# Paramétrage HTTPD pour groupe "web"
sed -i \
    -e "/^User apache/s,apache,${WEB_USERNAME},g" \
    -e "/^Group apache/s,apache,${WEB_GROUPNAME},g" \
    ${HTTPD_CONF_FILE}

# ===================
# Print startup infos
# ===================
_echo "ENV Vars :"
_echo -e "Webserver parameters :
     WEB_APP_DIR=${WEB_APP_DIR:-} (DocumentRoot --> /var/www/html par défaut),
     WEB_APP_INDEX=${WEB_APP_INDEX:=index.php index.html} (DirectoryIndex)
"

# TUNING
_echo "** HTTPD_MPM : [1m${HTTPD_MPM:=event}[0m"

# PHPFPM
_echo -e "\n** HTTPD_ENABLE_PHPFPM_INET : [1m${HTTPD_ENABLE_PHPFPM_INET:=false}[0m"
if [ "${HTTPD_ENABLE_PHPFPM_INET}" == "true" ]; then
  _echo "**   PHPFPM_HOST=[1m${PHPFPM_HOST:=phpfpm}[0m"
  _echo "**   PHPFPM_PORT=[1m${PHPFPM_PORT:=9000}[0m"
fi

# CGI
_echo -e "\n** HTTPD_ENABLE_CGI : [1m${HTTPD_ENABLE_CGI:=false}[0m"
_echo ""

# Do the job !
IP=$(hostname -i | cut -d" " -f1)

# ==========================
# == Paramétrage de HTTPD ==
# ==========================
# MPM (if MPM=event is specified, use it, else use "prefork" as default)
case "${HTTPD_MPM}" in
   prefork) sed -i -e '/LoadModule mpm_prefork/s,^#,,' \
                   -e '/LoadModule mpm_worker/d' \
                   -e '/LoadModule mpm_event/d' \
		        ${LOADMODULE_MPM_FILE}
		;;
   worker)  sed -i -e '/LoadModule mpm_worker/s,^#,,' \
                   -e '/LoadModule mpm_prefork/d' \
                   -e '/LoadModule mpm_event/d' \
		        ${LOADMODULE_MPM_FILE}
            ;;
   event)   sed -i -e '/LoadModule mpm_event/s,^#,,' \
                   -e '/LoadModule mpm_worker/d' \
                   -e '/LoadModule mpm_prefork/d' \
		        ${LOADMODULE_MPM_FILE}
            ;;
   *)       echo "Err: MPM should be 'event', 'worker' or 'prefork', not '$HTTPD_MPM'"
            exit 1
esac

# Make pidfile dir
mkdir -p /run/apache2

# Apache tuning on default httpd.conf
sed -i -e '/LoadModule slotmem_shm_module/s/^#//' ${LOADMODULE_BASE_FILE}

# ================================
# HTTPD_ENABLE_PERSISTENT_ERRORLOG
# ================================
if [ "${HTTPD_ENABLE_PERSISTENT_ERRORLOG}" == true ] ; then  
	    DEFINES="${DEFINES} -D ENABLE_PERSISTENT_ERRORLOG"
fi

# =================================
# HTTPD_ENABLE_PERSISTENT_ACCESSLOG
# =================================
if [ "${HTTPD_ENABLE_PERSISTENT_ACCESSLOG}" == true ] ; then  
	    DEFINES="${DEFINES} -D ENABLE_PERSISTENT_ACCESSLOG"
fi

# ==============================
# HTTPD_DISABLE_STDOUT_ACCESSLOG
# ==============================
if [ "${HTTPD_DISABLE_STDOUT_ACCESSLOG}" == true ] ; then  
	    DEFINES="${DEFINES} -D DISABLE_STDOUT_ACCESSLOG"
fi

# ===========================================
# HTTPD_ENABLE_PHPFPM is true ==> Activate it
# ===========================================
if [ "${HTTPD_ENABLE_PHPFPM_INET}" == true ] ; then  
	    DEFINES="${DEFINES} -D ENABLE_PHPFPM_INET"
	    export PHPFPM_HOST PHPFPM_PORT
fi

# =========================================
# HTTPD_ENABLE_CGI is true ==> Activate CGI
# =========================================
if [ "${HTTPD_ENABLE_CGI}" == true ] ; then  
   sed -i -e '/LoadModule cgi_module/s,#,,' ${LOADMODULE_BASE_FILE}

   sed -i -e '/index\.html$/s,$, index.sh index.cgi,' \
          -e '/Options Indexes FollowSymLinks *$/s,$, ExecCGI,' \
          -e '/AddHandler.*cgi-script.*cgi/s,#,,' \
          -e '/AddHandler.*cgi-script.*cgi/s,$, .sh .py,' \
          ${LOADMODULE_CGI_FILE}
fi

# ===========================================
# HTTPD_ENABLE_STATUS is true ==> Activate it
# ===========================================
if [ "${HTTPD_ENABLE_STATUS}" == true ] ; then  
	    DEFINES="${DEFINES} -D ENABLE_STATUS"
      sed -i -e "/_STATUS_URI_/s,_STATUS_URI_,${HTTPD_STATUS_URI:=/status}," \
             -e "/_STATUS_ALLOWED_IP_/s,_STATUS_ALLOWED_IP_,${HTTPD_STATUS_ALLOWED_IP:=127.0.0.1}," \
          ${VHOST_CONF_FILE}
      # Remove authz_host if "any" ip is allowed
      if [ "${HTTPD_STATUS_ALLOWED_IP}" == "any" ] ; then
        sed -i -e "/Require ip any/d" ${VHOST_CONF_FILE}
      fi
fi

# =======================================================
# Paramétrage VirtualHost : DocumentRoot + DirectoryIndex
# =======================================================
sed -i -e "/_DOCUMENTROOT_/s,_DOCUMENTROOT_,/var/www/html/${WEB_APP_DIR}," \
       -e "/_DIRECTORYINDEX_/s,_DIRECTORYINDEX_,${WEB_APP_INDEX}," \
          ${VHOST_CONF_FILE}

# =======================================================
# Paramétrage du serveur : 50-global.conf
# =======================================================
set | grep "^HTTPD_GLOBAL__" | while read L ; do
 echo "${L#HTTPD_GLOBAL__}" | sed -e 's,=, ,' 
done > ${GLOBAL_CONF_FILE}

# ============================
# Set permissions in /httplogs
# ============================
chown -R root.${WEB_GROUPNAME} /httpdlogs 
chmod -R 2775                  /httpdlogs 

# ======================================
# Définition de la commande d'avant plan
# ======================================
echo "
[program:httpd]
command=/usr/sbin/httpd -D FOREGROUND ${DEFINES}
" > /etc/supervisord.d/httpd.ini


_echo ""
_echo -e "======================================="
_echo "   Listening to http://${IP}:80/"
_echo "   DocumentRoot is /var/www/html/${WEB_APP_DIR}."
_echo "   Please tune /var/www/html/.htaccess to your needs."
_echo -e "======================================="


