import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialImportModule } from './material-import.module';

import { AppComponent } from './app.component';

import { AsperaNodeApiService } from './services/aspera-node-api.service';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MaterialImportModule,
    BrowserAnimationsModule
  ],
  providers: [AsperaNodeApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
