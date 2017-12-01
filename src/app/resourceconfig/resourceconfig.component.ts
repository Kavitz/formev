import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ResourceConfigService } from './resourceconfig.service';
import { VcenterService } from '../vcenter/vcenter.service';
      
@Component({
  selector: 'vr-resorceconfig',
  templateUrl: 'resourceconfig.component.html'
})

export class ResourceConfigComponent implements AfterViewInit{
    private pageHeading: string = "Manage Resource Configuration";
    private editdeletedisable: boolean = true;
	private ovftemplates: any;
	private vcenters: any;
	private resconfigs:any;
	private datastores: any;
	private datacenters: any;
	private deletename: any;
	private currentrc: any = {name: "",vcenter: "",ovftemplate: "", serverip: window.location.href.split("//")[1].split("/")[0].split(":")[0], datastore: "", datacenter: "", cluster:"", domain:"de.alcatel-lucent.com",network:"",netgmre:"",netoamp:"",nete1:"",nete2:""};
	private addResource = {name: "",vcenter: "",ovftemplate: "", serverip: window.location.href.split("//")[1].split("/")[0].split(":")[0], datastore: "", datacenter: "", cluster:"", domain:"de.alcatel-lucent.com",network:"",netgmre:"",netoamp:"",nete1:"",nete2:""};
	
    constructor(private resourceConfigService: ResourceConfigService, private vcenterservice: VcenterService){
		this.editdeletedisable = true;
		this.vcenterservice.getVcenter()
    	.subscribe(vcenters => {
      		console.log(vcenters);
      		this.vcenters = vcenters;
      		console.log("this.vcenters in resorce -- "+ this.vcenters);
    	})

		this.resourceConfigService.getOVFTemplates()
		.subscribe(ovftemplates => {
			console.log(ovftemplates);
			this.ovftemplates = ovftemplates;
			console.log("this.ovftemplates in resorce-- "+ this.ovftemplates);
		})
    }

	ngAfterViewInit() {
		console.log("inside ngAfterViewInit");
		this.resourceConfigService.getResourceConfig()
		.subscribe(resconfigs => {
			this.createTable(resconfigs);
		})
		$.getScript('assets/wulfdist/js/components/dialog.js');  
		$.getScript('assets/wulfdist/js/components/dlg-wizard.js');  
	}

	createTable(resconfigs:any){
      let source =
      {
          localdata: resconfigs,
          datafields: [
              {name: 'name', type: 'string'},
              {name: 'vcenter', type: 'string'},
              {name: 'datacenter', type: 'string'}, 
              {name: 'vcenteruser', type: 'string'},
              {name: 'datastore', type: 'string'},
              {name: 'cluster', type: 'string'},
              {name: 'domain', type: 'string'},
              {name: 'network', type: 'string'},
              {name: 'netgmre', type: 'string'},
              {name: 'netoamp', type: 'string'},
              {name: 'nete1', type: 'string'},
              {name: 'nete2', type: 'string'},
              {name: 'ovfdefault', type: 'string'}
          ],
          datatype: "array",
          sortcolumn: 'name',
          sortdirection: 'asc'
      };
  	
	  let columns = [
        {
          text: 'Name',
          columntype: 'custom',
          datafield: 'name',
          width: '30%'
        },
        {
          text: 'OVF Template',
          columntype: 'custom',
          datafield: 'ovfdefault',
          width: '30%'
        },
        {
            text: 'vCenter',
            columntype: 'custom',
            datafield: 'vcenter',
            width: '30%'
        },
        {
          text: 'data center',
          columntype: 'custom',
          datafield: 'datacenter',
          hidden: true
        },
        {
          text: 'vcenter user',
          columntype: 'custom',
          datafield: 'vcenteruser',
          hidden: true
        },
        {
          text: 'data store',
          columntype: 'custom',
          datafield: 'datastore',
          hidden: true
        },
        {
          text: 'cluster',
          columntype: 'custom',
          datafield: 'cluster',
          hidden: true
        },
        {
          text: 'domain',
          columntype: 'custom',
          datafield: 'domain',
          hidden: true
        },
        {
          text: 'network',
          columntype: 'custom',
          datafield: 'network',
          hidden: true
        },
        {
          text: 'netgmre',
          columntype: 'custom',
          datafield: 'netgmre',
          hidden: true
        },
        {
          text: 'netoamp',
          columntype: 'custom',
          datafield: 'netoamp',
          hidden: true
        },
        {
          text: 'nete1',
          columntype: 'custom',
          datafield: 'nete1',
          hidden: true
        },
        {
          text: 'nete2',
          columntype: 'custom',
          datafield: 'nete2',
          hidden: true
        }
       ];
      let dataAdapter1 = new (<any> $).jqx.dataAdapter(source, {
      async: false
      });
      (<any>$("#resourceDiv")).jqxGrid(
        {
          width: '100%',
          height: 390,
          source: dataAdapter1,
          editable: false,
          columnsResize: true, //columns resizable
          columnsreorder: true, //reorder columns
          selectionmode: 'singlerow',
          enableBrowserSelection: true,
          autoshowcolumnsmenubutton: true,
          altRows: true,
          sortable: true,
          columns: columns,
          scrollBarSize: 8,
          handlekeyboardnavigation: function (e) {
            return $.grid.handlekeyboardnavigation(e);
          }
        });
        
        $("#resourceDiv").bind('rowselect', (event: any) => {
          let row = event.args.rowindex;
          let datarow = $("#resourceDiv").jqxGrid('getrowdata', row);
          console.log(datarow);
		  this.deletename = datarow.name;
		  console.log(this.vcenters);
		  var tempvcenter;
		  var tempovf;
		  console.log("this.vcenters --- ",this.vcenters);
		  for(i in this.vcenters){
		  	if(this.vcenters[i].name == datarow.vcenter){
				tempvcenter = this.vcenters[i];
				break;
			}
			}
			console.log(this.ovftemplates);
			for(i in this.ovftemplates){
			console.log(this.ovftemplates[i].name);
		  if(this.ovftemplates[i].name == datarow.ovfdefault){
		  tempovf = this.ovftemplates[i];
		  	break;
			}
			}
			console.log(tempovf);
			console.log("tempvcenter -------- ",tempvcenter);
		this.resourceConfigService.getDataCenterForVC(tempvcenter)
		.subscribe(datacenters => {
			this.datacenters = datacenters;
				console.log("this.datastores", this.datacenters);
					this.datacenters = this.datacenters.filter(Boolean);	
					})
		console.log(this.datacenters);
			var temp1 = {'name': tempvcenter.name,'ipaddress': tempvcenter.ipaddress, 'username': tempvcenter.username, 'password':tempvcenter.password, 'datacenter': datarow.datacenter};
		this.resourceConfigService.getDataStoreForVC(temp1)
		.subscribe(datastores => {
			console.log("finalresult --------- ", datastores);
				this.datastores = datastores;
				})
				console.log(this.datastores);
	  this.currentrc = {'name': datarow.name, 'serverip' : window.location.href.split("//")[1].split("/")[0].split(":")[0], 'ovftemplate' : tempovf, 'vcenter' : tempvcenter,  'datacenter' : datarow.datacenter, 'datastore': datarow.datastore, 'cluster': datarow.cluster, 'domain': datarow.domain, 'network': datarow.network, 'netgmre': datarow.netgmre, 'netoamp' : datarow.netoamp, 'nete1': datarow.nete1, 'nete2': datarow.nete2};
          this.editdeletedisable = false;
        });
    }

	onRefreshClick() {
	    console.log(".maskloader --- ",$(".maskloader"));
    	$(".maskloader").show();
		this.resourceConfigService.getResourceConfig()
        .subscribe(resconfigs => {
            this.createTable(resconfigs);
        })
	    $("#resourceDiv").jqxGrid('clearselection');
    	this.editdeletedisable = true;
	    //this.cleanup();
    	$(".maskloader").hide();
  	}		

	onAddCancel() {
		this.addResource = {name: "",vcenter: "",ovftemplate: "", serverip: window.location.href.split("//")[1].split("/")[0].split(":")[0], datastore: "", datacenter: "", cluster:"", domain:"de.alcatel-lucent.com",network:"",netgmre:"",netoamp:"",nete1:"",nete2:""};
	}
	onDeleteConfirm() {
	    $(".maskloader").show();
		this.resourceConfigService.deleteResourceConfig(this.deletename)
		.subscribe(logmsg => {
      		console.log(logmsg.affectedRows);
	     	if(logmsg.affectedRows == 1){
        		this.onRefreshClick();
      		}
    	})
	//this.cleanup();
    	$(".maskloader").hide();
  	}
    onvCenterChange(){
    	console.log(this.addResource.vcenter);
		this.resourceConfigService.getDataCenterForVC(this.addResource.vcenter)
        .subscribe(datacenters => {
            console.log("finalresult --------- ", datacenters);
			this.datacenters = datacenters[0].split("###");
			console.log("this.datastores", this.datacenters);
			this.datacenters = this.datacenters.filter(Boolean);
			console.log("this.datacenters", this.datacenters);
      	})		
    }
	
	onDataStoreChange(){
		console.log(this.addResource.vcenter);
		console.log(this.addResource.datacenter);
		var temp = {'name': this.addResource.vcenter.name,'ipaddress': this.addResource.vcenter.ipaddress, 'username': this.addResource.vcenter.username, 'password':this.addResource.vcenter.password, 'datacenter': this.addResource.datacenter};
		this.resourceConfigService.getDataStoreForVC(temp)
		.subscribe(datastores => {
            console.log("finalresult --------- ", datastores);
			this.datastores = datastores;
		})
	}

	onEditConfirm(){
		$(".maskloader").show();
	this.resourceConfigService.deleteResourceConfig(this.deletename)
	.subscribe(logmsg => {
		console.log(logmsg.affectedRows);
		if(logmsg.affectedRows == 1){
			let addrc = {'name':this.currentrc.name,'vcenter':this.currentrc.vcenter.name,'datacenter':this.currentrc.datacenter,'vcenteruser':this.currentrc.vcenter.username+":"+this.currentrc.vcenter.password,'datastore':this.currentrc.datastore,'cluster':this.currentrc.cluster,'domain':this.currentrc.domain,'network':this.currentrc.network,'netgmre':this.currentrc.netgmre,'netoamp':this.currentrc.netoamp,'nete1':this.currentrc.nete1,'nete2':this.currentrc.nete2,'ovfdefault':this.currentrc.ovftemplate.name};
			this.resourceConfigService.addResourceConfiguration(addrc)
			.subscribe(result => {
				$("#editresource").modal('hide');
				let addrcfile = {'name':this.currentrc.name,'vcenter':this.currentrc.vcenter.ipaddress,'datacenter':this.currentrc.datacenter,'vcenteruser':this.currentrc.vcenter.username+":"+this.currentrc.vcenter.password,'datastore':this.currentrc.datastore,'cluster':this.currentrc.cluster,'domain':this.currentrc.domain,'network':this.currentrc.network,'netgmre':this.currentrc.netgmre,'netoamp':this.currentrc.netoamp,'nete1':this.currentrc.nete1,'nete2':this.currentrc.nete2,'ovfdefault':this.currentrc.ovftemplate.url};
				this.resourceConfigService.addResourceConfigurationfile(addrcfile)
				.subscribe(result => {
					console.log("result -------- ", result);
				})
				console.log("result ------ ",result);
				this.onRefreshClick();
			})
		}
	})
	//this.cleanup();
	$(".maskloader").hide();	
	}
	onAddConfirm(){
		 let addrc = {'name':this.addResource.name,'vcenter':this.addResource.vcenter.name,'datacenter':this.addResource.datacenter,'vcenteruser':this.addResource.vcenter.username+":"+this.addResource.vcenter.password,'datastore':this.addResource.datastore,'cluster':this.addResource.cluster,'domain':this.addResource.domain,'network':this.addResource.network,'netgmre':this.addResource.netgmre,'netoamp':this.addResource.netoamp,'nete1':this.addResource.nete1,'nete2':this.addResource.nete2,'ovfdefault':this.addResource.ovftemplate.name};
		this.resourceConfigService.addResourceConfiguration(addrc)
		.subscribe(result => {
			$("#addresource").modal('hide');
			let addrcfile = {'name':this.addResource.name,'vcenter':this.addResource.vcenter.ipaddress,'datacenter':this.addResource.datacenter,'vcenteruser':this.addResource.vcenter.username+":"+this.addResource.vcenter.password,'datastore':this.addResource.datastore,'cluster':this.addResource.cluster,'domain':this.addResource.domain,'network':this.addResource.network,'netgmre':this.addResource.netgmre,'netoamp':this.addResource.netoamp,'nete1':this.addResource.nete1,'nete2':this.addResource.nete2,'ovfdefault':this.addResource.ovftemplate.url};
			this.resourceConfigService.addResourceConfigurationfile(addrcfile)
			.subscribe(result => {
				console.log("result -------- ", result);
			})
			console.log("result ------ ",result);
			this.onRefreshClick();
		})	
	}
}
