# Beauty Harmony

React + Vite сайт-витрина для брендов Beauty Harmony и каталога товаров из Uzum Market.

## Структура проекта

- `src/main.jsx` - точка входа React-приложения. Подключает главный компонент и CSS.
- `src/BeautyHarmonyWebsite.jsx` - основной файл сайта: страницы, роутинг через hash URL, тексты RU/UZ, карточки брендов, каталог, B2B-форма.
- `src/data/uzumCatalogProducts.generated.js` - сгенерированные товары из Uzum. Обычно этот файл не редактируют вручную.
- `src/styles/base.css` - базовые стили: переменные, reset, общие настройки страницы.
- `src/styles/website.css` - стили интерфейса сайта: hero-блоки, карточки, каталог, формы, адаптив.
- `public/beauty-harmony-hero.png` - главная картинка для hero/B2B-блока.
- `scripts/update-uzum-catalog.ps1` - PowerShell-скрипт, который заново собирает товары с Uzum и обновляет файл данных.
- `scripts/serve-production-build.mjs` - простой Node.js сервер для локального запуска собранной папки `dist`.
- `index.html` - HTML-шаблон, куда Vite подключает React-приложение.
- `package.json` - зависимости проекта и npm-команды.

## Команды

```bash
npm install
npm run vite:dev
npm run build
npm run serve
npm run catalog:update
```

- `npm run vite:dev` - запуск разработки через Vite.
- `npm run build` - сборка готового сайта в папку `dist`.
- `npm run serve` - локальный просмотр собранного сайта.
- `npm run catalog:update` - обновление товаров из Uzum.

## Заметка для передачи проекта

Папки `node_modules` и `dist`, а также `.log` / `.err` файлы не нужно передавать как исходный код. После получения проекта разработчик запускает `npm install`, затем `npm run vite:dev` или `npm run build`.
