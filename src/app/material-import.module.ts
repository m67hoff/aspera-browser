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

import { MatTableModule } from '@angular/material/table';

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
        MatSnackBarModule,
        MatTableModule,
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
        MatSnackBarModule,
        MatTableModule,
    ]
})
export class MaterialImportModule {
}
