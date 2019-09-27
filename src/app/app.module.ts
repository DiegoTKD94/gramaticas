import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

// Componentes de la aplicacion
import { GramaticasComponent } from './components/gramaticas/gramaticas.component';
import { HomeComponent } from './components/home/home.component';
import { DocumentacionComponent } from './components/documentacion/documentacion.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';

// Importar rutas
import { ROUTES } from './app.routes';

// Angular material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';



@NgModule({
  declarations: [
    AppComponent,
    GramaticasComponent,
    HomeComponent,
    DocumentacionComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot( ROUTES, { useHash: true } ),
    MatInputModule,
    MatListModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
