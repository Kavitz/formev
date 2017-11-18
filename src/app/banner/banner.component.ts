import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'vr-banner',
  templateUrl: 'banner.component.html'
})
export class BannerComponent implements AfterViewInit {
  private username: string = 'admin';

  ngAfterViewInit(): void {
    $.getScript('assets/wulfdist/js/components/navbar.js');

    let source = {
      rl: 'AccountUser/Information',
      type: 'post',
      datatype: 'json',
      datafields: [{ name: 'UserId' }, { name: 'FirstName' }, { name: 'LastName'}]
    };
    let dataAdapter = new (<any> $).jqx.dataAdapter(source);
    console.log(dataAdapter);
    //$('.n-banner-1st').hide();
  }
}
