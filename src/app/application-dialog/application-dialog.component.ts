import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-application-dialog',
  template: `
    <h1 mat-dialog-title>{{ data.get('id')!.value ? 'Edit Application' : 'Add Application' }}</h1>
    <div mat-dialog-content>
      <form [formGroup]="data">
        <mat-form-field>
          <input matInput placeholder="Name" formControlName="name">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Version" formControlName="version">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="URL" formControlName="url">
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button [mat-dialog-close]="data" cdkFocusInitial>Save</button>
    </div>
  `
})
export class ApplicationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ApplicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FormGroup
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close();
  }
}