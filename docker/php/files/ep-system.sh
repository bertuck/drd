#!/bin/bash
# Set Locale
export LANG=${LANG:-fr_FR.UTF-8}
echo LANG="${LANG}" > /etc/locale.conf

# Set Timezone
export TZ=${TIMEZONE:-Europe/Paris}
# System
ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Tuning ldap.conf
sed -i -e "\$a\
TLS_REQCERT      ${LDAP_TLS_REQCERT:-never}" /etc/openldap/ldap.conf

# Conf SSMTP
cat <<END > /etc/ssmtp/ssmtp.conf
[root@asal-longecote html]# cat /etc/ssmtp/ssmtp.conf
# The person who gets all mail for userids < 1000
# Make this empty to disable rewriting.
root=postmaster

# The place where the mail goes. The actual machine name is required
# no MX records are consulted. Commonly mailhosts are named mail.domain.com
# The example will fit if you are in domain.com and your mailhub is so named.
mailhub=${SMTP_RELAY_HOST:-NO_SMTP_RELAY_CONFIGURED}:${SMTP_RELAY_PORT:-25}

# Where will the mail seem to come from?
#RewriteDomain=

# The full hostname
Hostname=${SMTP_DOMAIN_NAME:-localdomain}

# Set this to never rewrite the "From:" line (unless not given) and to
# use that address in the "from line" of the envelope.
#FromLineOverride=YES

# Use SSL/TLS to send secure messages to server.
#UseTLS=YES
#IMPORTANT: The following line is mandatory for TLS authentication
TLS_CA_File=/etc/pki/tls/certs/ca-bundle.crt

# Use SSL/TLS certificate to authenticate against smtp host.
#UseTLSCert=YES

# Use this RSA certificate.
#TLSCert=/etc/pki/tls/private/ssmtp.pem

# Get enhanced (*really* enhanced) debugging information in the logs
# If you want to have debugging of the config file parsing, move this option
# to the top of the config file and uncomment
#Debug=YES
END

