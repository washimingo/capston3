import { HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory() {
  return new TranslateHttpLoader();
}

export const TRANSLATE_PROVIDER = [
  importProvidersFrom(
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ),
  provideHttpClient(withInterceptors([])),
  {
    provide: APP_INITIALIZER,
    useFactory: (translate: TranslateService) => () => {
      const lang = localStorage.getItem('saf-lang') || 'es';
      translate.setDefaultLang('es');
      return translate.use(lang).toPromise();
    },
    deps: [TranslateService],
    multi: true
  }
];
