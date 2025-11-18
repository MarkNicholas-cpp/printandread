import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Add error handling for bootstrap
console.log('🚀 Starting Angular application...');

bootstrapApplication(App, appConfig)
  .then(() => {
    console.log('✅ Angular application bootstrapped successfully!');
  })
  .catch((err) => {
    console.error('❌ Error bootstrapping Angular application:', err);
    // Display error on page if bootstrap fails
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #d32f2f;">Application Error</h1>
        <p>Failed to start the application. Please check the console for details.</p>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;">${err.message || err}</pre>
      </div>
    `;
  });
