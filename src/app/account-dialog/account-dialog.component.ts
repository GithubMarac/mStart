import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-account-dialog',
  template: `
    <h1 mat-dialog-title>{{ data.get('id')!.value ? 'Edit Account' : 'Add Account' }}</h1>
    <div mat-dialog-content>
      <form [formGroup]="data">
        <mat-form-field>
          <input matInput placeholder="Email" formControlName="email">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="First Name" formControlName="firstName">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Last Name" formControlName="lastName">
        </mat-form-field>
        <mat-form-field>
          <input matInput [matDatepicker]="picker" placeholder="Date of Birth" formControlName="dateOfBirth">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-checkbox formControlName="active">Active</mat-checkbox>
      </form>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button [mat-dialog-close]="data" cdkFocusInitial>Save</button>
    </div>
  `
})
export class AccountDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FormGroup
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }
}