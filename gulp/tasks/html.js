// импорт плагина для сборки html файлов при помощи @@include('',{})
import fileInclude from "gulp-file-include";

// плагин фиксирует версию сборки, для предотвращения кэширования стилей в браузере
import cachebust from "gulp-cache-bust";

// сохранение файлов html
export const html = () => {
   return app.gulp.src(app.path.src.html) // копирование из исходников
      .pipe(app.plugins.plumber(app.plugins.notify.onError({
         title: "HTML",
         message: "Error: <%= error.message %>"
      })))
      .pipe(fileInclude({
         prefix: '@@',
         basepath: '@file'
      })) // сборка файлов при помощи @@include
      .pipe(app.plugins.replace(/@img\//g, './img/'))
      .pipe(cachebust({
         type: 'timestamp',
         createSourceMap: true,
      }))
      .pipe(app.gulp.dest(app.path.build.html)) // запись файлов сборки
      .pipe(app.plugins.browsersync.stream());
}


// настройки для gulp-cache-bust (версионирование файлов css, js)
// cacheBust({
//    type: 'timestamp',   // способ генерации версии: 'timestamp' или 'MD5'
//    basePath: '',        // базовый путь для поиска файлов
//    deleteOriginals: false, // удалять ли оригинальные файлы после переименования
//    createSourceMap: false, // создавать ли sourcemap для переименованных файлов
//    output: '',          // путь для сохранения manifest.json (если нужен)
//    exclude: [],         // массив регулярных выражений для исключения файлов из версионирования
//    replaceInExtensions: ['.html', '.php'], // в каких типах файлов искать ссылки для замены
//    verbose: true        // выводить подробные логи в консоль
//  })
// type

// 'timestamp' → добавляет текущую метку времени (?v=1670000000000).
// 'MD5' → генерирует хэш содержимого файла (?v=abcd1234).
// basePath
// Указывает корневую папку, относительно которой искать файлы для хэширования.
// deleteOriginals
// Если true, оригинальные файлы удаляются, остаются только версии с хэшами.
// createSourceMap
// Если true, создаётся карта соответствия оригинальных имён и новых (полезно для отладки).
// output
// Путь к файлу, куда будет записан manifest (например, dist/cache-bust.json).
// exclude
// Массив регулярных выражений для исключения файлов. Пример: exclude: [/^(https?:)?\/\//] исключает все внешние ссылки.
// replaceInExtensions
// Список расширений файлов, внутри которых будут заменяться ссылки. По умолчанию: ['.html', '.php'].
// verbose
// Если true, в консоль выводятся подробные сообщения о том, какие файлы были обработаны.