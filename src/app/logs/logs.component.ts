import {  Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { LogService } from './logs.service';

@Component({
    selector: 'vr-logs',
    templateUrl: 'logs.component.html'
})
export class LogComponent{
	private pageHeading: string = "Deployment Logs";
	private logMessage: string = "";
	constructor(private logservice : LogService){
		this.logservice.getLog().subscribe(log => { this.logMessage = log; console.log("log --",this.logMessage);});
	}
	onRefreshClick(){
		this.logservice.getLog().subscribe(log => { this.logMessage = log; console.log("log --",this.logMessage);});
	}
}
