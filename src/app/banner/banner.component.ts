import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'vr-banner',
  templateUrl: 'banner.component.html'
})
export class BannerComponent implements AfterViewInit {
  private username: string = 'admin';

  ngAfterViewInit(): void {
    $.getScript('assets/wulfdist/js/components/navbar.js');
  }
}
