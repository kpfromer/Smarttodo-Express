const gulp = require('gulp');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const plumber = require('gulp-plumber');
const del = require('del');

gulp.task('clean', () => del('dist'));

gulp.task('compile', ['clean'], () =>
  gulp.src('./src/**/*.js')
    .pipe(plumber())
    .pipe(babel({
      presets: ['@babel/env'],
      plugins: ['@babel/transform-runtime', 'transform-class-properties']
    }))
    .pipe(gulp.dest('dist'))
);

gulp.task('watch', () => 
  nodemon({
    script: 'dist/app.js',
    watch: 'src',
    tasks: ['compile']
  })
)

gulp.task('default', ['watch'])