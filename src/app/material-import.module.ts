import { NgModule } from '@angular/core';
import {
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatListModule,
    MatProgressBarModule,
    MatTabsModule,
    MatDialogModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,

} from '@angular/material';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';

import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';

@NgModule({
    imports: [
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatInputModule,
        MatCheckboxModule,
        MatRadioModule,
        MatListModule,
        MatProgressBarModule,
        MatTabsModule,
        MatDialogModule,
        MatMenuModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatSortModule,

        MatTooltipModule,
        MatBadgeModule,

        MatTableModule,
        CdkTableModule,
    ],

    exports: [
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatInputModule,
        MatCheckboxModule,
        MatRadioModule,
        MatListModule,
        MatProgressBarModule,
        MatTabsModule,
        MatDialogModule,
        MatMenuModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatSortModule,

        MatTooltipModule,
        MatBadgeModule,

        MatTableModule,
        CdkTableModule,
    ]
})
export class MaterialImportModule { }