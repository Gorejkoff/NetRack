import * as dartSass from "sass"; //  препроцессор SASS
import gulpSass from "gulp-sass"; // плагин запуска препроцессора
import sourcemaps from "gulp-sourcemaps"; // создание файла sourcemap
import rename from "gulp-rename";// переименовывание файла css
import autoPrefixer from "gulp-autoprefixer"; // добавление вендерных префиксов
import groupCssMediaQueries from "gulp-group-css-media-queries" //группировка медиа запросов

const sass = gulpSass(dartSass); // плагин запуска препроцессора запускает препроцессор в константе

export const scss = () => {
   return app.gulp.src(app.path.src.scss, { sourcemaps: app.isBuild }) // адрес откуда брать файлы. sourcemaps: true - карта, из какого файла записан фрагмент 
      .pipe(app.plugins.plumber(app.plugins.notify.onError({
         title: "SCSS",
         message: "Error: <%= error.message %>"
      })))
      .pipe(sourcemaps.init())
      .pipe(app.plugins.replace(/@img\//g, '../img/'))
      .pipe(sass({ outputStyle: 'expanded' })) // вызов компилятора с указанным стилем файла
      .pipe(app.plugins.if(app.isBuild, groupCssMediaQueries())) // группировка медиа запросов
      .pipe(app.plugins.if(app.isBuild, autoPrefixer({
         grid: true,
         overrideBrowserslist: ["last 3 version"],
         cascade: true,
      })))
      // .pipe(rename("style.css")) // переименовывает файл в style.scss
      .pipe(rename(function (path) {
         path.basename = path.basename.replace('.scss', '.css'); // оставляет именя как у scss файлов
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(app.gulp.dest(app.path.build.css))  // запись файла scss => css
      .pipe(app.gulp.src(app.path.src.css)) // берёт файлы css
      .pipe(app.gulp.dest(app.path.build.css)) // запись их в сборку
      .pipe(app.plugins.browsersync.stream()); // перезапуск браузера
}