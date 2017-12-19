import { NgModule } from '@angular/core';
import {
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatListModule,
    MatProgressBarModule,
    MatTabsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,

} from '@angular/material';

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
    MatListModule,
    MatProgressBarModule,
    MatTabsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,

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
        MatListModule,
        MatProgressBarModule,
        MatTabsModule,
        MatDialogModule,
        MatPaginatorModule,
        MatSortModule,
    
        MatTableModule,
        CdkTableModule,
    ]
})
export class MaterialImportModule {
}
