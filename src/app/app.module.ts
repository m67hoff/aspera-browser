import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialImportModule } from './material-import.module';

import { AppComponent } from './app.component';

import { AsperaNodeApiService } from './services/aspera-node-api.service';
import { SizePipe, RatePipe } from './pipes/size.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { CreateDirDialogComponent } from './dialog/create-dir-dialog.component';
import { DeleteConfDialogComponent } from './dialog/delete-conf-dialog.component';

import { ConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';


@NgModule({
  declarations: [
    AppComponent,
    SizePipe, RatePipe,
    DurationPipe,
    CreateDirDialogComponent,
    DeleteConfDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialImportModule,
    BrowserAnimationsModule,
    ConfigModule,
    LoggerModule
  ],
  entryComponents: [CreateDirDialogComponent, DeleteConfDialogComponent],
  providers: [AsperaNodeApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
