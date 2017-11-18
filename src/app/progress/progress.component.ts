import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'vr-progress',
  templateUrl: 'progress.component.html'
})

export class ProgressComponent implements AfterViewInit{
	ngAfterViewInit(): void {
		$.getScript('assets/wulfdist/js/components/flyout-activity-area.js');
	}
}
