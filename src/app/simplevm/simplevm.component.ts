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
  private enablevalgrind: boolean = false;
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
  private nodeproperties : any;
  private disablenode: boolean = true;
  private ramunit: string = "gb";
  private ramsize: number = 1;
  private vmdiskmode: string = "thinprovision";
  //private infomessage: string = "Please select resource Configuration !";
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

 getVMProperties(){
        this.disablenode = true;
        this.simplevm.getNodeProperties(this.resourceconfig)
        .subscribe(nodeproperties => {
        this.nodeproperties = nodeproperties;
                console.log("before this.nfsmount",this.nfsmount);
                console.log("this.nodeproperties ---",this.nodeproperties);

                if(this.nodeproperties != "notdata"){
                console.log("this.nodeproperties ---",this.nodeproperties);
                this.nfsmount = this.nodeproperties[0].mounturl;
                this.nebuild = this.nodeproperties[0].build;
                this.enablevalgrind = this.nodeproperties[0].valgrind;
                this.copylocally = this.nodeproperties[0].copylocally;
                this.shelfmode = this.nodeproperties[0].shelfmode;
                this.mastershelf = this.nodeproperties[0].shelftype;
                this.autocommission = this.nodeproperties[0].commission;
                this.loopbackip = this.nodeproperties[0].loopbackip;
                this.nodetid = this.nodeproperties[0].nodetid;
                this.simbootlevel = this.nodeproperties[0].bootlevel;
                } else {
					this.nfsmount = "http://slsbem.de.alcatel-lucent.com/pss24loads/archives";
					this.nebuild = "1830PSS-23.14-70";
					this.enablevalgrind = false;
					this.copylocally = false;
					this.shelfmode = "Sonet";
					this.mastershelf = "PSS32";
					this.autocommission = false;
					this.loopbackip = "";
					this.nodetid = "n1";
					this.simbootlevel = "";
				}
                console.log("after this.nfsmount",this.nfsmount);
                this.disablenode = false;
                $("div").removeClass("blockexpand");
        })
  }


  setEnable(){
    console.log("setEnable");
  }

  deployVM(){
	var sendValues = {'rc':this.resourceconfig.replace(".cfg",""), 'vmname':this.vmname, 'ipaddress':this.ipaddresss};
	if(this.nfsmount != "")
		sendValues.nfsmount = this.nfsmount;
	else 
		sendValues.nfsmount = "http://slsbem.de.alcatel-lucent.com/pss24loads/archives";
	if(this.nebuild != "")
		sendValues.nebuild = this.nebuild;
	else 
		sendValues.nebuild = "1830PSS-23.14-70";
	sendValues.mainshelf = this.mastershelf;
	sendValues.mode = this.shelfmode;
	if(this.copylocally)
		sendValues.copylocally = this.copylocally;
	if(this.enablevalgrind)
		sendValues.enablevalgrind = this.enablevalgrind;
	if(this.nodetid != "")
		 sendValues.nodetid = this.nodetid;
	if(this.loopback != "")
		sendValues.loopback = this.loopback;
	if(this.simbootlevel != "")
		sendValues.simbootlevel = this.simbootlevel;
	if(this.enablegmre){
		sendValues.enablegmre = this.enablegmre;
		if(this.gmrebuild != "")
			sendValues.gmrebuild = this.gmrebuild;
		if(this.gmreloadurl != "")
			sendValues.gmreloadurl = this.gmreloadurl;
		if(this.nodeip != "")
			sendValues.nodeip = this.nodeip;
		if(this.notifyip != "")
			sendValues. notifyip = this.notifyip;
	}
    //var sendValues = [[this.resourceconfig.replace(".cfg",""),this.vmname,this.ipaddresss],[this.nfsmount,this.nebuild,this.mastershelf,this.copylocally,this.shelfmode,this.nodetid]];
    console.log("sendValues   ------------ ",sendValues);
    this.simplevm.deployVM(sendValues)
    .subscribe(resultmsg => {
      this.result = resultmsg;
      $("#ConfirmationDialog").modal('show');
      window.location.reload();
    })
  }

	refreshPage(){
  	window.location.reload();
  }
}
