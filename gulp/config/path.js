

// получаем имя папки проекта
import * as nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());


const buildFolder = `./dist`; // путь к папке с результатами, папка buildFolder будет создаваться автоматически в процесе действий gulp
const srcFolder = `./src`; // путь к папке с исходниками

// объект path хранит информацию о пути к файлам
export const path = {
   // объект путей к папке с результатом
   build: {
      js: `${buildFolder}/js/`,
      images: `${buildFolder}/img/`,
      webp: `${buildFolder}/img/webp/`,
      svgSprite: `${buildFolder}/img/svgSprite/`,
      css: `${buildFolder}/css/`,
      html: `${buildFolder}/`,
      files: `${buildFolder}/`,
      fonts: `${buildFolder}/fonts/`,
   },
   // объект путей к папке с исходниками
   src: {
      appjs: `${srcFolder}/js/app_js/app.js`, // путь к главному файлу, будет первый в сборке
      jsmodules: `${srcFolder}/js/modules_js/!(_)*.js`, // модули, которые собираются в один файл (с _ игнорируются)
      js: `${srcFolder}/js/!(_)*.js`, // путь к файлам, которые не объединяются (с _ игнорируются)
      images: `${srcFolder}/img/!(webp)**/*.*`,
      svg: `${srcFolder}/img/**/*.svg`,
      webp: `${srcFolder}/img/webp/*.*`,
      scss: `${srcFolder}/scss/*.scss`,
      css: `${srcFolder}/css/!(_)*.css`,
      html: `${srcFolder}/*.html`,
      fonts: `${srcFolder}/fonts/**/*.{woff,woff2}`,
      files: `${srcFolder}/files/**/*.*`, // значение масок: перенос из папки files, ** в любых вложенных папках в папке files, *.* любые файлы
      svgicons: `${srcFolder}/svgicons/*.svg`,
   },
   // объект путей к папкам за которыми необходимо следить и выполнять определённые действия
   watch: {
      js: `${srcFolder}/js/**/*.js`,
      scss: `${srcFolder}/{scss,html}/**/*.scss`,
      html: `${srcFolder}/**/*.html`,
      files: `${srcFolder}/files/**/*.*`,
      images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp,ico,svg}`,
      fonts: `${srcFolder}/fonts/**/*.{otf,ttf,woff,woff2}`,
      svgSprive: `${srcFolder}/svgicons/*.svg`,
   },
   clean: buildFolder,
   buildFolder: buildFolder,
   srcFolder: srcFolder,
   rootFolder: rootFolder,
   ftp: `test`, // название папки на удалённом сервере
}
