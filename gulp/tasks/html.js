import fileInclude from "gulp-file-include"; 
import webpHtmlNosvg from "gulp-webp-html-nosvg";
import versionNumber from "gulp-version-number";

export const html = () => {
    return app.gulp.src(app.path.src.html) //путь к нашему главному html
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "HTML",
                message: "Error: <%= error.message %>"
            }))
        )
        .pipe(fileInclude())    //модуль, который склеивает наши куски html    
        .pipe(app.plugins.replace(/@img\//g, 'img/')) // заменям @img/ в прошакшн html файле на img/
        .pipe(
            app.plugins.if(
                app.isBuild,
                webpHtmlNosvg()
            )
        )
        .pipe(
            app.plugins.if(
                app.isBuild,                
                versionNumber({ // плагин версионирования добавляет таймштамп, чтобы изменения обновлялись у заказчика
                    'value': '%DT%',
                    'append': {
                        'key': '_v',
                        'cover': 0,
                        'to': [
                            'css',
                            'js',
                        ]
                    },
                    'output': {
                        'file': 'gulp/version.json'
                    }
                })
            )
        )
        .pipe(app.gulp.dest(app.path.build.html))//куда мы копируем файлы
        .pipe(app.plugins.browsersync.stream());// в браузер
    }