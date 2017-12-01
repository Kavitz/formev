import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VcenterComponent } from './vcenter/vcenter.component';
import { ResourceConfigComponent } from './resourceconfig/resourceconfig.component';
import { OvfsComponent } from './ovfs/ovfs.component';
import { SimplevmComponent } from './simplevm/simplevm.component';
import { LogComponent } from './logs/logs.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'prefix'},
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, outlet: 'home' }
  // { path: 'home/vCenter', component: VcenterComponent, outlet: 'home'},
  // { path: 'home/simplevm', component: SimplevmComponent, outlet: 'home'},
  // { path: 'home/resourceconfig', component: ResourceConfigComponent, outlet: 'home'},
  // { path: 'home/ovfs', component: OvfsComponent, outlet: 'home'},
  // { path: 'home/logs', component: LogComponent, outlet: 'home'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
