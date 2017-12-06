import { NgModule } from '@angular/core';
import {
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatDialogModule,
    MatMenuModule,
    MatSnackBarModule
} from '@angular/material';

@NgModule({
    imports: [
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatCheckboxModule,
        MatRadioModule,
        MatInputModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatTabsModule,
        MatDialogModule,
        MatMenuModule,
        MatSnackBarModule
    ],
    exports: [
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatCheckboxModule,
        MatRadioModule,
        MatInputModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatTabsModule,
        MatDialogModule,
        MatMenuModule,
        MatSnackBarModule
    ]
})
export class MaterialImportModule {
}
