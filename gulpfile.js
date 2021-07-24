const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config');
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const del = require('del');
// sourcemaps, postcss, browser-sync, etc.


const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

const paths = {
    root: `./dist`,
    templates: {
        index: './src/templates/index.pug',
        src: './src/templates/**/*.pug',
        dest: './dist/',
    },
    styles: {
        main: './src/styles/main.scss',
        src: './src/styles/**/*.s{c,a}ss',
        dest: './dist/styles',
    },
    scripts: {
        index: './src/scripts/index.js',
        src: './src/scripts/**/*.js',
        dest: './dist/scripts',
    },
}


gulp.task('serve', function() {
    gulp.watch(paths.styles.src, gulp.series('styles'));
    gulp.watch(paths.templates.src, gulp.series('templates'));
    gulp.watch(paths.scripts.src, gulp.series('scripts'));
});

gulp.task('clean', function() {
    return del(paths.root);
});

gulp.task('templates', function() {
    return gulp.src(paths.templates.index)
        .pipe(pug({pretty: isDev}))
        .pipe(gulp.dest(paths.root));
});

gulp.task('styles', function() {
    return gulp.src(paths.styles.main)
        // .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: !isDev ? 'compressed' : 'expanded',
            includePaths: ['./node_modules/'],
        }))
        // .pipe(postcss([autoprefixer(), cssnano()]));
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.root));
        // .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
    let config = webpackConfig;
    let stream = gulp.src(paths.scripts.index)
        .on('data', function(file) {
            config = Object.assign({}, webpackConfig, {
                entry: {
                    main: file.path,
                },
            });
        });
    return stream
        .pipe(webpackStream(config))
        .pipe(gulp.dest(paths.scripts.dest));
});


let tasks = ['clean', gulp.parallel('templates', 'styles', 'scripts')]
if (isDev) {
    tasks.push('serve');
}
gulp.task('default', gulp.series(...tasks));