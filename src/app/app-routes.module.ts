import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VcenterComponent } from './vcenter/vcenter.component';
import { ResourceConfigComponent } from './resourceconfig/resourceconfig.component';
import { OvfsComponent } from './ovfs/ovfs.component';
import { SimplevmComponent } from './simplevm/simplevm.component';
import { LogComponent } from './logs/logs.component';

const routes: Routes = [
  { path: '', redirectTo: 'simplevm', pathMatch: 'prefix'},
  { path: 'vCenter', component: VcenterComponent},
  { path: 'simplevm', component: SimplevmComponent},
  { path: 'resourceconfig', component: ResourceConfigComponent},
  { path: 'ovfs', component: OvfsComponent},
  { path: 'logs' component: LogComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
