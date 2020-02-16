// https://github.com/thecodercoder/frontend-boilerplate
/*
|--------------------------------------------------------------------------
| DEPENDENCIES
|--------------------------------------------------------------------------
*/
// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const
    // Gulp utilisation
    gulp = require('gulp'),
    // Combine gulp with sass utilisation
    sass = require('gulp-sass'),
    // Combine multiples plugins
    postcss = require('gulp-postcss'),
    // Parser for scss
    //   scss = require('postcss-scss'),
    // Autoprefix css properties
    autoprefixer = require('autoprefixer'),
    // Clean and minify CSS files
    cssnano = require('cssnano'),
    // Clean and concat JS files
    concat = require('gulp-concat'),
    // Minify JS files
    uglify = require('gulp-uglify'),
    // Generate sourcemaps
    sourcemaps = require('gulp-sourcemaps'),
    // Twig
    twig = require('gulp-twig'),
    // Merge : Permet de faire plusieurs src en une task
    merge = require('merge-stream'),
    // Delete generated files
    del = require('del');
// EMBED SVG
embedSvg = require('gulp-embed-svg');

/*
|--------------------------------------------------------------------------
| CONFIGURATION
|--------------------------------------------------------------------------
*/
const target = {
    'src': './src/',
    'buildFolder': './__public/',
    'buildSite': './__public/site/',
    'buildStyleguide': './__public/styleguide/',
    'devFolder': './../'
};
// File paths
const files = {
    twigPath: target.src + 'twig/**/*.twig',
    scssPath: target.src + 'style/**/*.scss',
    scssToCompileOnlyPath: target.src + 'style/*.scss', // cible uniquement les scss qu'il faut compiler dans le dossier __public
    jsAppPath: target.src + 'script/app/**/*.js',
    jsPluginPath: target.src + 'script/plugin/**/*.js',
    fontPath: target.src + 'font/**/*.*',
    imgPath: target.src + 'img/**/*.*'
}

/*
|--------------------------------------------------------------------------
| TASKS
|--------------------------------------------------------------------------
*/
// Clean task: delete generated files
function clean(){
    return del(target.buildFolder);
}

// Twig task: compiles the .twig files into .html
function twigSite(){
    return src(target.src + 'twig/site/page/*.twig')
        .pipe(twig())
        .pipe(dest(target.buildSite));
}
function twigStyleguide(){
    return src(target.src + 'twig/styleguide/page/*.twig')
        .pipe(twig())
        .pipe(embedSvg({
            selectors: '.inline-svg',
            root: target.src + 'img/styleguide/'
        }))
        .pipe(dest(target.buildStyleguide));
}

// Sass task: compiles the style.scss file into style.css
function style(){
    return src(files.scssToCompileOnlyPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass().on('error', sass.logError)) // compile SCSS to CSS
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current targetectory
        .pipe(dest(target.buildSite + 'style'))
        .pipe(dest(target.buildStyleguide + 'style')) // put final CSS in dist folder
        .pipe(dest(target.devFolder + 'style'));
}

// JS APP task: concatenates and uglifies JS files to app.js
function scriptApp(){
    return src([
        //
        // OPEN
        target.src + 'script/app/_jquery-open.js',
        //
        // Appeler tous les autres scripts ici
        target.src + 'script/app/_cookies.js',
        target.src + 'script/app/_cover.js',
        target.src + 'script/app/_table.js',
        target.src + 'script/app/_a11y-fixes.js',
        target.src + 'script/app/_iframe.js',
        target.src + 'script/app/_nav-primary.js',
        target.src + 'script/app/_adjustAnchor.js',
        target.src + 'script/app/_hidepassword.js',
        target.src + 'script/app/_glider.js',

        //
        // init des scripts du dessus
        target.src + 'script/app/app.js',

        //
        // Close
        target.src + 'script/app/_jquery-close.js'
    ])
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(dest(target.buildSite + 'script'))
        .pipe(dest(target.buildStyleguide + 'script'))
        .pipe(dest(target.devFolder + 'script'));
}

// JS PLUGIN task: concatenates and uglifies JS files to vendor.js
function scriptPlugin(){
    return src([
        //
        // OPEN
        target.src + 'script/app/_jquery-open.js',
        //
        // Appeler tous les autres scripts ici
        target.src + 'script/plugin/popper/popper-min.js', // Nécessaire pour faire fonctionner les dropdown
        target.src + 'script/plugin/bootstrap/util.js',
        target.src + 'script/plugin/bootstrap/alert.js',
        target.src + 'script/plugin/bootstrap/button.js',
        // target.src + 'script/plugin/bootstrap/carousel.js',
        target.src + 'script/plugin/bootstrap/collapse.js',
        target.src + 'script/plugin/bootstrap/dropdown.js',
        target.src + 'script/plugin/bootstrap/modal.js',
        target.src + 'script/plugin/bootstrap/tooltip.js', // Tooltip doit être appelé avant popover : https://stackoverflow.com/questions/18599382/twitter-bootstrap-popover-not-working
        target.src + 'script/plugin/bootstrap/popover.js',
        target.src + 'script/plugin/bootstrap/scrollspy.js',
        target.src + 'script/plugin/bootstrap/tab.js',
        // target.src + 'script/plugin/bootstrap/toast.js',
        //
        target.src + 'script/plugin/what-input/what-input.js',
        target.src + 'script/plugin/glider/glider-compat.min.js', // compatibilité IE
        target.src + 'script/plugin/glider/glider.js',
        target.src + 'script/plugin/hideShowPassword/hideShowPassword.min.js',
        //
        // CLOSE
        target.src + 'script/app/_jquery-close.js'

    ])
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(dest(target.buildSite + 'script'))
        .pipe(dest(target.buildStyleguide + 'script'))
        .pipe(dest(target.devFolder + 'script'));
}

// Assets task: copy JS, fonts and imgs
function assets(){
    const assetsJs = src([
        target.src + 'script/plugin/modernizr/modernizr.js',
        target.src + 'script/plugin/detectizr/detectizr.js',
        target.src + 'script/plugin/jquery/jquery-3.3.1.min.js',
        target.src + 'script/plugin/prism/prism.js'
    ])
        .pipe(dest(target.buildSite + 'script'))
        .pipe(dest(target.buildStyleguide + 'script'))
        .pipe(dest(target.devFolder + 'script'));

    const assetsFont = src(target.src + 'font/**/*.*')
        .pipe(dest(target.buildSite + 'font'))
        .pipe(dest(target.buildStyleguide + 'font'))
        .pipe(dest(target.devFolder + 'font'));

    const assetsImg = src(target.src + 'img/**/*')
        .pipe(dest(target.buildSite + 'img'))
        .pipe(dest(target.buildStyleguide + 'img'));

    return merge(assetsJs, assetsFont, assetsImg);
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask(){
    watch([
            files.twigPath,
            files.scssPath,
            files.jsAppPath,
            files.jsPluginPath,
            files.fontPath,
            files.imgPath
        ],
        parallel(twigSite, twigStyleguide, style, scriptApp, scriptPlugin, assets));
}

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then watch task
exports.default = series(
    clean,
    parallel(twigSite, twigStyleguide, style, scriptApp, scriptPlugin, assets)
);

exports.watch = series(
    clean,
    parallel(twigSite, twigStyleguide, style, scriptApp, scriptPlugin, assets),
    watchTask
);