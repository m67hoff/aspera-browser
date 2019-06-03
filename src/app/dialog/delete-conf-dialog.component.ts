import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-delete-conf-dialog',
  template: `
    <h1 mat-dialog-title>Delete Confirmation</h1>
    <div mat-dialog-content>
      <p>really delete {{ data.nr }} documents ?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="dialogRef.close('ok')" tabindex="1"> Ok </button>
      <button mat-button (click)="onNoClick()" tabindex="-1"> Cancel </button>
    </div>
  `,
  styles: []
})
export class DeleteConfDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteConfDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onNoClick() { this.dialogRef.close(); }
}
