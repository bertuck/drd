#!/bin/bash
cd /root
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"; 
php -r "\$lines=file('https://composer.github.io/installer.sig',FILE_IGNORE_NEW_LINES); if (  hash_file('SHA384', 'composer-setup.php') ===  \$lines[0] ) { echo 'Installer verified'; } else { echo 'Insta    ller corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"; 
php composer-setup.php --install-dir=/usr/local/bin --filename=composer; 
php -r "unlink('composer-setup.php');"
