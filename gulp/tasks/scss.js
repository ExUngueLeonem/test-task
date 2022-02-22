import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css'; // сжимает css файл
import webpcss from 'gulp-webpcss'; //вывод webp изображений
import autoprefixer from 'gulp-autoprefixer';//добавление вендорныз префиксов
import groupCssMediaQueries from 'gulp-group-css-media-queries';//группировка медиазапросов

const sass = gulpSass(dartSass);

export const scss = () => {
    return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                    title: "SCSS",
                    message: "Error: <% error.message %>"
            })))
        .pipe(app.plugins.replace(/@img\//g, '../img/'))
        .pipe(sass({
                    outputStyle: 'expanded'
        }))
        .pipe(
            app.plugins.if(
                app.isBuild,
                groupCssMediaQueries()
            ) 
        )//if
        .pipe(
            app.plugins.if(
                app.isBuild,
                autoprefixer({
                        grid: true,
                        overrideBrowserslist: ['last 3 versions'],
                        cascade: true
                })            
            ) 
        )//if
        .pipe(
            app.plugins.if(
                app.isBuild,
                webpcss(//if
                    {
                        webpClass: ".webp",
                        noWebpClass: ".no-webp"
                    }
                )            
            ) 
        )//if
        //отдает несжатый дубль файлов стилей
        .pipe(app.gulp.dest(app.path.build.css))
        .pipe(
            app.plugins.if(
                app.isBuild,
                cleanCss()            ) 
        )//if
        .pipe(rename(
            {
                extname: '.min.css'
            }
        ))
        .pipe(app.gulp.dest(app.path.build.css))
        .pipe(app.plugins.browsersync.stream());
}