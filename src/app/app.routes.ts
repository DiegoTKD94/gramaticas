import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DocumentacionComponent } from './components/documentacion/documentacion.component';
import { GramaticasComponent } from './components/gramaticas/gramaticas.component';


export const ROUTES: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'documentacion', component: DocumentacionComponent },
    { path: 'gramaticas', component: GramaticasComponent },
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: '**', pathMatch: 'full', redirectTo: 'home' }
];
