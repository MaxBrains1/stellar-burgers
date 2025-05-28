import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Здесь можно добавить дополнительные обработчики событий, если нужно
      // Например, для логирования или обработки ошибок
    },
    baseUrl: 'http://localhost:4000', // Базовый URL твоего приложения
    specPattern: 'cypress/e2e/**/*.cy.{ts,tsx}', // Шаблон для поиска тестов
    supportFile: 'cypress/support/e2e.ts', // Файл с глобальными настройками
    viewportWidth: 1280, // Ширина окна браузера
    viewportHeight: 720, // Высота окна браузера
    defaultCommandTimeout: 10000, // Таймаут для команд (10 секунд)
    pageLoadTimeout: 60000, // Таймаут для загрузки страницы (60 секунд)
    video: false, // Отключение записи видео (можно включить, если нужно)
    retries: {
      runMode: 2, // Количество повторных попыток в режиме "run"
      openMode: 0 // Количество повторных попыток в режиме "open"
    }
  }
});
