import webp from "gulp-webp";
// import flatten from "gulp-flatten"; // убирает вложенность в папки
//import { reset } from "../tasks/reset.js";


export const images = () => {
   return app.gulp.src(app.path.src.images)
      .pipe(app.gulp.dest(app.path.build.images))
      .pipe(app.gulp.src(app.path.src.webp))
      .pipe(app.plugins.plumber(
         app.plugins.notify.onError({
            title: "IMAGES",
            message: "Error: <%= error.message %>"
         })))
      .pipe(app.plugins.newer(app.path.build.images))
      .pipe(webp({
         quality: 75,           // Качество 1-100
         lossless: false,       // Без потерь
         alphaQuality: 80,      // Качество альфа-канала
         method: 6,             // Метод сжатия (0-6)
         preset: 'photo',       // 'default', 'photo', 'picture', 'drawing'
         sns: 50,               // Пространственная шумоподавка
         filter: 50,            // Сила фильтра
         autoFilter: false,     // Авто-фильтр
         sharpness: 0,          // Резкость
         verbose: false         // Вывод информации
      }))
      // .pipe(flatten())
      .pipe(app.gulp.dest(app.path.build.webp))
      .pipe(app.plugins.browsersync.stream());
}