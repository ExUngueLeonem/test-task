import fs from 'fs';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';

export const otfToTtf = () => {
    //ищем файлы шрифтов
    return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "FONTS",
                message: "Error: <%= error.message %>"
            }))
        )
        //Конвертируем в .ttf
        .pipe(fonter({
            formats: ['ttf']
        }))
        //Выгружаем в исходную папку
        .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
}
export const ttfToWoff = () => {
    //Ищем файлы шрифтов
    return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "FONTS",
                message: "Error: <%= error.message %>"
            }))
        )
        //Конвертируем в .woff
        .pipe(fonter({
            formats: ['woff']
        }))
        //Выгружаем в папку с результатом
        .pipe(app.gulp.dest(`${app.path.build.fonts}`))
        //Ищем файлы шрифтов .ttf
        .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
        //Конвертируем в .woff2
        .pipe(ttf2woff2())
        //Выгружаем в папку с результатом
        .pipe(app.gulp.dest(`${app.path.build.fonts}`));
}
export const fontsStyle = () => {
    //файл стилей подключения шрифтов
    let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;
    //Проверяем сушествует ли файл шрифтов
    fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
        if (fontsFiles) {
            //Проверяем существует ли файл стилей для подключения шрифтов
            if (!fs.existsSync(fontsFiles)) {
                //Если файла нет, создаем его
                fs.writeFile(fontsFile, '', cb);
                let newFileOnly;
                for (var i = 0; i < fontsFiles.length; i++) {
                    //записываем подключения шрифтов в файл стилей
                    let fontFileName = fontsFiles[i].split('.')[0];
                    if (newFileOnly !== fontFileName) {
                        let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
                        let fontWeigth = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
                        if (fontWeigth.toLowerCase() === 'thin') {
                            fontWeigth = 100;
                        } else if (fontWeigth.toLowerCase() === 'extralight') {
                            fontWeigth = 200;
                        } else if (fontWeigth.toLowerCase() === 'light') {
                            fontWeigth = 300;
                        } else if (fontWeigth.toLowerCase() === 'medium') {
                            fontWeigth = 500;
                        } else if (fontWeigth.toLowerCase() === 'semibold') {
                            fontWeigth = 600;
                        } else if (fontWeigth.toLowerCase() === 'bold') {
                            fontWeigth = 700;
                        } else if (fontWeigth.toLowerCase() === 'extrabold' || fontWeigth.toLowerCase() === 'heavy') {
                            fontWeigth = 800;
                        } else if (fontWeigth.toLowerCase() === 'black') {
                            fontWeigth = 900;
                        } else {
                            fontWeigth = 400;
                        }
                        fs.appendFile(fontsFile,
                            `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weigth: ${fontWeigth};\n\tfont-style: normal;\n}\r\n`, cb);
                        newFileOnly = fontFileName;
                    }
                }

            } else {
                //если файл есть, вывводим сообщение
                console.log("Файл scss/fonts.scss уже существует. Для обновления файла его нужно удалить");
            }
        }
    });
    return app.gulp.src(`${app.path.srcFolder}`);
    function cb() { }
}



/* 
    if (file_content == '') { 
        fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) { 
            if (items) { let c_fontname; 
            for (var i = 0; i < items.length; i++) { let fontname = items[i].split('.'); fontname = fontname[0]; 
            if (c_fontname != fontname) { fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb); } c_fontname = fontname; } } 
        }) }
    
    }
    
    function cb() { } */
    