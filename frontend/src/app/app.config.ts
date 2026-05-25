import { DOCUMENT } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { normalizeLocale } from './core/config/locale.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    {
      provide: LOCALE_ID,
      useFactory: (document: Document) => normalizeLocale(document.documentElement.lang),
      deps: [DOCUMENT],
    },
  ],
};
