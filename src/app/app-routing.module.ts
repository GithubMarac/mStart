import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsGridComponent } from './accounts-grid/accounts-grid.component';
import { CrudScreenComponent } from './crud-screen/crud-screen.component';

const routes: Routes = [
  { path: '', component: AccountsGridComponent },
  { path: 'crud', component: CrudScreenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }