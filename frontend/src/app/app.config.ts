import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, ErrorHandler } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';

// Global error handler
class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('🚨 Global Error Handler:', error);
    // You can also send errors to a logging service here
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};
