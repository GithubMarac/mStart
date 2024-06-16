import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FirestoreService } from '../../firestoreService';

@Component({
  selector: 'app-applications-grid',
  templateUrl: './applications-grid.component.html',
  styleUrls: ['./applications-grid.component.css']
})
export class ApplicationsGridComponent implements OnChanges {
  @Input() accountId: string;
  applications: any[] = [];
  displayedColumns: string[] = ['name', 'version', 'url'];

  constructor(private firestoreService: FirestoreService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accountId) {
      this.loadApplications();
    }
  }

  loadApplications(): void {
    if (this.accountId) {
      this.firestoreService.getApplicationsByAccountId(this.accountId).subscribe(data => {
        this.applications = data;
      });
    }
  }
}