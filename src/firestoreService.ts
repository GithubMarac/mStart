import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  // Accounts CRUD
  getAccounts() {
    return this.firestore.collection('accounts').valueChanges({ idField: 'id' });
  }

  addAccount(account: any) {
    return this.firestore.collection('accounts').add(account);
  }

  updateAccount(account: any) {
    return this.firestore.collection('accounts').doc(account.id).update(account);
  }

  deleteAccount(id: string) {
    return this.firestore.collection('accounts').doc(id).delete();
  }

  // Applications CRUD
  getApplicationsByAccountId(accountId: string) {
    return this.firestore.collection('applications', ref => ref.where('accountId', '==', accountId)).valueChanges({ idField: 'id' });
  }

  addApplication(application: any) {
    return this.firestore.collection('applications').add(application);
  }

  updateApplication(application: any) {
    return this.firestore.collection('applications').doc(application.id).update(application);
  }

  deleteApplication(id: string) {
    return this.firestore.collection('applications').doc(id).delete();
  }
}