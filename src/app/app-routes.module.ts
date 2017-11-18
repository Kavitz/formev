import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VcenterComponent } from './vcenter/vcenter.component';
import { SimplevmComponent } from './simplevm/simplevm.component';

const routes: Routes = [
  { path: '', redirectTo: 'simplevm', pathMatch: 'prefix'},
  { path: 'vCenter', component: VcenterComponent},
  { path: 'simplevm', component: SimplevmComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
