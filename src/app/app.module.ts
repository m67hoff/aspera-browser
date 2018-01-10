import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialImportModule } from './material-import.module';

import { AppComponent } from './app.component';

import { AsperaNodeApiService } from './services/aspera-node-api.service';
import { SizePipe } from './pipes/size.pipe';
import { CreateDirDialogComponent } from './dialog/create-dir-dialog.component';
import { DeleteConfDialogComponent } from './dialog/delete-conf-dialog.component';

import { LoggerService } from './services/logger.service';


@NgModule({
  declarations: [
    AppComponent,
    SizePipe,
    CreateDirDialogComponent,
    DeleteConfDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialImportModule,
    BrowserAnimationsModule
  ],
  entryComponents: [CreateDirDialogComponent, DeleteConfDialogComponent],
  providers: [AsperaNodeApiService, LoggerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
