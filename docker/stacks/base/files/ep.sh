#!/bin/bash

# Test de présence de sudo (images de DEV seulement)
if [ -x /usr/bin/sudo ];
then
  # SUDO="sudo --preserve-env=PHPFPM_POOL_CONFIG,USER_NAME,USER_UID"
  SUDO="sudo -E"
fi

# Preparation PHP ... + whatever the app adds
for S in /ep.d/*.sh
do
    ${SUDO} $S
done

# Lancement du processus d'avant plan 
exec "$@"
