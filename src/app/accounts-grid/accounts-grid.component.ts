// accounts-grid.component.ts
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../firestoreService';

@Component({
  selector: 'app-accounts-grid',
  templateUrl: './accounts-grid.component.html',
  styleUrls: ['./accounts-grid.component.css']
})
export class AccountsGridComponent implements OnInit {
  accounts: any[] = [];
  displayedColumns: string[] = ['email', 'firstName', 'lastName', 'dateOfBirth', 'active'];
  selectedAccount: any;

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    this.firestoreService.getAccounts().subscribe(data => {
      this.accounts = data;
    });
  }

  onSelect(account: any): void {
    this.selectedAccount = account;
  }
}