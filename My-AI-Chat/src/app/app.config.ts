import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withFetch()),
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes), provideAnimations(),
  importProvidersFrom(MatCardModule, MatButtonModule, MatInputModule, MatToolbarModule, MatIconModule, MatMenuModule, MatSelectModule, MatProgressSpinnerModule)],
};



