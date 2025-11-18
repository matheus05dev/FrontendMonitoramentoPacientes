// CRÍTICO: Definir global ANTES de qualquer import
// Isso deve ser feito antes de qualquer outro código ser executado
(function() {
  if (typeof window !== 'undefined' && !(window as any).global) {
    (window as any).global = window;
  }
  if (typeof globalThis !== 'undefined' && !(globalThis as any).global) {
    (globalThis as any).global = typeof window !== 'undefined' ? window : globalThis;
  }
})();

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
