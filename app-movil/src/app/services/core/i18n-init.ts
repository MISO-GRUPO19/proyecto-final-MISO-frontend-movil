import { inject, runInInjectionContext, EnvironmentInjector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export function initTranslate(injector: EnvironmentInjector) {
    runInInjectionContext(injector, () => {
        const translate = inject(TranslateService);
        translate.setDefaultLang('es');
        translate.use('es');
    });
}
