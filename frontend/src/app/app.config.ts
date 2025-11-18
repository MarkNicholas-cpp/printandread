import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, Router } from '@angular/router';

import { routes } from './app.routes';

// Function to redirect root path to /home
function initializeApp(router: Router): () => Promise<void> {
  return () => {
    return new Promise<void>((resolve) => {
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath === '') {
        router.navigate(['/home'], { replaceUrl: true }).then(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [Router],
      multi: true
    }
  ]
};
