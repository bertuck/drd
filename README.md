# DRD - Drupal React Dashboard

It's a React Dashboard included into a custom Drupal 8.

- Docker Drupal stack (httpd 2.4, php 7.3, mysql 5.6, node 10.16)
- Drupal stack (default config, modules, meterial_admin, front_theme, composer.json)
- Drupal custom front theme (preprocess engine, access forms, gulp stack, bootstrap4)
- React JS Dashboard application link to theme (/dashboard)
- Makefile with custom commands, forced to be used
- Tools : Makefile / composer / drush / npm / gulp / parcel
- OS : CentOS Linux 7
- Languages/Frameworks : PHP7, MySQL, JS (ES6, ES7), ReactJS, JQuery, Drupal (Symfony 2), CSS3, HTML5, Bootstrap4

## Dependencies

* [Docker](https://docs.docker.com/installation/) >= 18.02.0
* [Docker-compose](https://docs.docker.com/compose/install/) >= 1.20

## Install

```
make install-from-scratch
```
```
make reinstall-from-scratch
```

### First steps

- Copy the host ```http://<project_name>.local``` and go to your browser
- Go to /user/login, login as admin/admin and go to admin/config/development/generate/content
- Generate 100 News, Articles and Basic Pages
- Go to /dashboard
- This is a Drupal/React demo made with love, this is only for development environment only.

## URLs

| Target  | Description |
|------|-------------|
| SITE LOCAL| http://<project_name>.local | 


## Need a command ?
```
make help
```


## Contributor
 - [Kenni Bertucat](https://github.com/bertuck) - DEVELOPER FULLSTACK
