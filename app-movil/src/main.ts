import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initTranslate } from './app/services/core/i18n-init';

bootstrapApplication(AppComponent, appConfig)
  .then(appRef => {
    const injector = appRef.injector;
    initTranslate(injector); // ✅ esta es la parte segura
  })
  .catch((err) => console.error(err));
