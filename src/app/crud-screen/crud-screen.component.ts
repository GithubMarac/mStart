// crud-screen.component.ts
import { Component, OnInit, ViewChild  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../firestoreService';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AccountDialogComponent } from '../account-dialog/account-dialog.component';
import { ApplicationDialogComponent } from '../application-dialog/application-dialog.component';


export interface Account {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  active: boolean;
}

export interface Application {
  id?: string;
  name: string;
  version: string;
  url: string;
  accountId: string;
}

@Component({
  selector: 'app-crud-screen',
  templateUrl: './crud-screen.component.html',
  styleUrls: ['./crud-screen.component.css']
})
export class CrudScreenComponent implements OnInit {
  accounts: any[] = [];
  applications: any[] = [];
  selectedAccount: any = null;
  accountForm: FormGroup;
  appForm: FormGroup;
  selectedApplication: any = null;

  filteredAccounts: MatTableDataSource<any>;
  filteredApplications: MatTableDataSource<any>;

  private subscriptions: Subscription[] = [];

  @ViewChild('emailFilter') emailFilter: any;
  @ViewChild('startDateFilter') startDateFilter: any;
  @ViewChild('endDateFilter') endDateFilter: any;
  @ViewChild('nameFilter') nameFilter: any;
  @ViewChild('versionFilter') versionFilter: any;

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

    this.filteredAccounts = new MatTableDataSource(this.accounts);
    this.filteredApplications = new MatTableDataSource(this.applications);
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts() {
    this.subscriptions.push(
      this.firestoreService.getAccounts().subscribe(data => {
        this.accounts = data.map((account) => ({
          ...account,
        }));
        this.filteredAccounts.data = this.accounts;
      })
    );
  }

  loadApplications(accountId: string) {
    this.firestoreService.getApplicationsByAccountId(accountId).subscribe(data => {
      this.filteredApplications.data = data;
    });
  }

  applyAccountFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredAccounts.filterPredicate = (data, filter) => {
      return data.email.toLowerCase().includes(filter);
    };
    this.filteredAccounts.filter = filterValue;
  }

  applyDateFilter() {
    const startDate = this.startDateFilter.nativeElement.value;
    const endDate = this.endDateFilter.nativeElement.value;

    this.filteredAccounts.filterPredicate = (data, filter) => {
      const dateOfBirth = new Date(data.dateOfBirth);
      return (!startDate || new Date(startDate) <= dateOfBirth) && (!endDate || dateOfBirth <= new Date(endDate));
    };

    // Trigger the filter
    this.filteredAccounts.filter = '' + Math.random();
  }

  applyApplicationFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredApplications.filterPredicate = (data, filter) => {
      const filterName = this.nameFilter.nativeElement.value.trim().toLowerCase();
      const filterVersion = this.versionFilter.nativeElement.value.trim().toLowerCase();
      return data.name.toLowerCase().includes(filterName) && data.version.toLowerCase().includes(filterVersion);
    };
    this.filteredApplications.filter = filterValue;
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
        if (account) {
          this.updateAccount();
          this.selectedAccount = account;
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
        if (this.selectedApplication) {
          this.updateApplication();
          this.selectedApplication = null;
        } else {
          this.addApplication();
        }
      }
    });
  }
}