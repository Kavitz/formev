import {  Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { SimpleVMService } from './simplevm.service';
import { simplevmproperties } from './simplevm.model';

@Component({
    selector: 'vr-simplevm',
    templateUrl: 'simplevm.component.html'
})

export class SimplevmComponent implements AfterViewInit{
  private simplevmproperties: simplevmproperties;
  private result: any;
  private resourceconfiguration: any;
  private resourceconfig: string = "";
  private folderlocation: string;
  private vmname: string;
  private ipaddresss: string = "";
  private nfsmount: string = "http://slsbem.de.alcatel-lucent.com/pss24loads/archives";
  private nebuild: string = "1830PSS-23.14-70";
  private enablevalgrind: boolean = true;
  private copylocally: boolean;
  private shelfmode: string = "Sonet";
  private mastershelf: string = "PSS32";
  private autocommission: boolean;
  private loopbackip: string;
  private nodetid: string = "n1";
  private simbootlevel: string;
  private ipallocation: string;
  private enablegmre: boolean;
  private gmrebuild: string;
  private gmreloadurl: string;
  private nodeip: string;
  private notifyip: string;
  private vmdiskmode: string;
  private memorysize: string;
  private novirtualsocket: number;
  private numbterofcores: number;

  constructor(private simplevm : SimpleVMService){
    this.simplevm.getResource()
    .subscribe(resourceconfiguration => {
        this.resourceconfiguration = resourceconfiguration;
    })
  }

  ngAfterViewInit(): void {
    $.getScript('assets/wulfdist/js/components/panels.js');   
    // this.simplevmproperties.nfsmount = "135.112.248.203://mnt/cloudsim/pssloads";
  }

  deployVM(){
    var sendValues = [[this.resourceconfig.replace(".cfg",""),this.vmname,this.ipaddresss],[this.nfsmount,this.nebuild,this.mastershelf,this.copylocally,this.shelfmode,this.nodetid]];
    console.log("sendValues   ------------ ",sendValues);
    this.simplevm.deployVM(sendValues)
    .subscribe(resultmsg => {
      this.result = resultmsg;
      $("#ConfirmationDialog").modal('show');
    })
  }

	refreshPage(){
  	window.location.reload();
  }
}
