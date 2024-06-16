// crud-screen.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../firestoreService';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import { AccountDialogComponent } from '../account-dialog/account-dialog.component';
import { ApplicationDialogComponent } from '../application-dialog/application-dialog.component';

@Component({
  selector: 'app-crud-screen',
  templateUrl: './crud-screen.component.html',
  styleUrls: ['./crud-screen.component.css']
})
export class CrudScreenComponent implements OnInit {
  accounts: any[] = [];
  applications: any[] = [];
  selectedAccount: any;
  accountForm: FormGroup;
  appForm: FormGroup;
  selectedApplication: any = null;

  displayedColumns: string[] = ['email', 'firstName', 'lastName', 'dateOfBirth', 'active', 'actions'];
  appDisplayedColumns: string[] = ['name', 'version', 'url', 'actions'];

  constructor(private firestoreService: FirestoreService, private fb: FormBuilder, public dialog: MatDialog) {
    this.accountForm = this.fb.group({
      id: [''],
      email: [''],
      firstName: [''],
      lastName: [''],
      dateOfBirth: [''],
      active: [true]
    });

    this.appForm = this.fb.group({
      id: [''],
      name: [''],
      version: [''],
      url: [''],
      accountId: ['']
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts() {
    this.firestoreService.getAccounts().subscribe(data => {
      this.accounts = data;
    });
  }

  loadApplications(accountId: string) {
    this.firestoreService.getApplicationsByAccountId(accountId).subscribe(data => {
      this.applications = data;
    });
  }

  selectAccount(account: any) {
    this.selectedAccount = account;
    this.loadApplications(account.id);
    this.selectedApplication = null;
  }

  selectApplication(application: any) {
    this.selectedApplication = application;
  }

  addAccount() {
    this.firestoreService.addAccount(this.accountForm.value).then(() => {
      this.loadAccounts();
      this.accountForm.reset();
    });
  }

  updateAccount() {
    this.firestoreService.updateAccount(this.accountForm.value).then(() => {
      this.loadAccounts();
      this.accountForm.reset();
    });
  }

  deleteAccount(id: string) {
    this.firestoreService.deleteAccount(id).then(() => {
      this.loadAccounts();
      this.selectedAccount = null;
      this.applications = [];
    });
  }

  addApplication() {
    this.appForm.patchValue({ accountId: this.selectedAccount.id });
    this.firestoreService.addApplication(this.appForm.value).then(() => {
      this.loadApplications(this.selectedAccount.id);
      this.appForm.reset();
    });
  }

  updateApplication() {
    this.firestoreService.updateApplication(this.appForm.value).then(() => {
      this.loadApplications(this.selectedAccount.id);
      this.appForm.reset();
    });
  }

  deleteApplication(id: string) {
    this.firestoreService.deleteApplication(id).then(() => {
      this.loadApplications(this.selectedAccount.id);
    });
  }


  openAccountDialog(account?: any) {
    if (account) {
      this.accountForm.setValue(account);
    }
    this.dialog.open(AccountDialogComponent, {
      width: '250px',
      data: this.accountForm
    });

    const dialogRef = this.dialog.open(AccountDialogComponent, {
      width: '250px',
      data: this.accountForm
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result.id)
        console.log(this.selectedAccount)
        if (result.id) {
          this.updateAccount();
        } else {
          this.addAccount();
        }
      }
    });
  }

openApplicationDialog(app?: any) {
    if (app) {
      this.appForm.setValue(app);
    } else {
      this.appForm.reset();
      this.appForm.patchValue({ accountId: this.selectedAccount.id });
    }

    const dialogRef = this.dialog.open(ApplicationDialogComponent, {
      width: '250px',
      data: this.appForm
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.updateApplication();
        } else {
          this.addApplication();
        }
      }
    });
  }
}