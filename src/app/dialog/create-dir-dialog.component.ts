import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-create-dir-dialog',
  template: `
    <h1 mat-dialog-title>Create New folder</h1>
    <div mat-dialog-content>
      <p>Folder Name:</p>
      <mat-form-field>
        <input matInput tabindex="1" [(ngModel)]="data.name">
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="data.name" tabindex="2">Ok</button>
      <button mat-button (click)="onNoClick()" tabindex="-1">Cancel</button>
    </div>
  `,
  styles: []
})
export class CreateDirDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CreateDirDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }
  onNoClick() { this.dialogRef.close(); }
}
