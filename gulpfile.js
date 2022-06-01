const { src, dest, watch, series, parallel } = require('gulp');

//CSS Y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

//IMAGENES
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css(done) {
    //compilar sass
    //pasos: 1 - identificar archivo, 2 - compilarla, 3 - guardar el .css
    src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'));

    done();
}

function imagenes() {
    return src('src/img/**/*')
        .pipe(imagemin({ optimizationlevel: 3 }))
        .pipe(dest('build/img'));
}

function versionwebp() {
    const opciones = {
        quality: 50,
    };

    return src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'));
}

function versionavif() {
    const opciones = {
        quality: 50,
    };

    return src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'));
}

function dev() {
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', imagenes);
}

module.exports.css = css;
module.exports.dev = dev;
module.exports.imagenes = imagenes;
module.exports.versionwebp = versionwebp;
module.exports.versionavif = versionavif;
module.exports.default = series(imagenes, versionwebp, versionavif, css, dev);

//series - se inicia una tarea y hasta qu efinaliza
//parallel - todas inician al mismo tiempo
