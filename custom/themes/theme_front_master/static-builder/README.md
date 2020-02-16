# S.K.E.L.E.T.O.R
 
- BEM pour le nommage des class et id
- SASS pour le CSS
- jQuery ou Vanilla JS selon le besoin
- Accessibilité : RGAA (AA) exigé
- GULP 4.x.x (gulp 3 n'est plus supporté)

# Génération du projet

- Installer NodeJS _(version projet : 12.4.0)_
- Installer NPM _(version projet : 6.9.0)_
- Lancer la commande :
```javascript
npm install --save-dev
```
- Le projet s'installe avec les dépendances node_modules
- Lancer la commande :
```javascript
gulp
```
- Le _gulpfile.js_ est interprété
- Le dossier *__public* est généré
- Les assets (css, js, img) sont envoyés dans le theme drupal selon le lien référencé dans le _gulpfile.js_


# Si le GULP plante
Faire :

- rm -rf node_modules
- rm -rf package-lock.json
- npm cache clean --force
- npm install

source : https://github.com/gulpjs/gulp/issues/2162#issuecomment-384885950(https://github.com/gulpjs/gulp/issues/2162#issuecomment-384885950)

## Les grands principes

### Base
- Héritage de Boostrap 4.x.x
- OOCSS et BEM 
- Architecture en Atomic Design
- Compilation via Gulp 4.x.x

### Javascript
Les plugins JS sont en jQuery pour la majorité d'entre eux. 
Ils respectent les patterns d'accessibilité.

### Accessibilité
Respecter le RGAA, coder de façon accessible tant en HTML (twig), en CSS et en JS.