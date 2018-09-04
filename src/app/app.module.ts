import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialImportModule } from './material-import.module';

import { AppComponent } from './app.component';

import { AsperaNodeApiService } from './services/aspera-node-api.service';
import { SizePipe, RatePipe } from './pipes/size.pipe';
import { DurationPipe, ETAPipe } from './pipes/duration.pipe';
import { StatusPipe, StringPipe } from './pipes/status.pipe';
import { CreateDirDialogComponent } from './dialog/create-dir-dialog.component';
import { DeleteConfDialogComponent } from './dialog/delete-conf-dialog.component';
import { InfoComponent } from './info/info.component';


import { ConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';
import { ZlibB64Module } from './zlib-b64/zlib-b64.module';

@NgModule({
  declarations: [
    AppComponent,
    SizePipe, RatePipe,
    DurationPipe, ETAPipe,
    StatusPipe, StringPipe,
    CreateDirDialogComponent,
    DeleteConfDialogComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialImportModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([{
      path: '',
      component: AppComponent
    },
    ]),
    ConfigModule,
    LoggerModule,
    ZlibB64Module
  ],
  entryComponents: [CreateDirDialogComponent, DeleteConfDialogComponent],
  providers: [AsperaNodeApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
