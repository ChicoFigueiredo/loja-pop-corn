import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CuponsComponent } from './cupons/cupons.component';

const routes: Routes = [{
  path: '',
  component: CuponsComponent,
  children: [{
    path: 'cupons',
    component: CuponsComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class ParametrosRoutingModule { }
