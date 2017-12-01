import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
// import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

import { VcenterService } from './vcenter/vcenter.service';
import { OvfsService } from './ovfs/ovfs.service';
import { ResourceConfigService } from './resourceconfig/resourceconfig.service';
import { SimpleVMService } from './simplevm/simplevm.service';
import { LogService } from './logs/logs.service';
import { LoginComponent } from './login/login.component';
import { BannerComponent } from './banner/banner.component';
import { FooterComponent } from './footer/footer.component';
import { VcenterComponent } from './vcenter/vcenter.component';
import { OvfsComponent } from './ovfs/ovfs.component';
import { SimplevmComponent } from './simplevm/simplevm.component';
import { ProgressComponent } from './progress/progress.component';
import { LogComponent } from './logs/logs.component';
import { HomeComponent } from './home/home.component';
import { ResourceConfigComponent } from './resourceconfig/resourceconfig.component';
import { AppRoutingModule } from './app-routes.module';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    BannerComponent,
    FooterComponent,
    ResourceConfigComponent,
    VcenterComponent,
    OvfsComponent,
    SimplevmComponent,
    ProgressComponent,
    LogComponent
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
    // RouterModule.forRoot(ROUTES, {
    //   useHash: Boolean(history.pushState) === false,
    //   preloadingStrategy: PreloadAllModules
    // })
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    ENV_PROVIDERS,
    APP_PROVIDERS,
    VcenterService,
    ResourceConfigService,
    SimpleVMService,
    OvfsService,
    LogService
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) {}

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    /**
     * Set state
     */
    this.appState._state = store.state;
    /**
     * Set input values
     */
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    /**
     * Save state
     */
    const state = this.appState._state;
    store.state = state;
    /**
     * Recreate root elements
     */
    store.disposeOldHosts = createNewHosts(cmpLocation);
    /**
     * Save input values
     */
    store.restoreInputValues  = createInputTransfer();
    /**
     * Remove styles
     */
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    /**
     * Display new elements
     */
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
