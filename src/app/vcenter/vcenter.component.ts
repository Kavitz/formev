import {  Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';

import { VcenterService } from './vcenter.service';
import { Vcenter } from './vcenter.model';
      


@Component({
  selector: 'vr-vcenter',
  templateUrl: 'vcenter.component.html'
})
export class VcenterComponent implements AfterViewInit{
  private pageHeading: string = 'Manage vCenter Servers';
  private vcenters: Vcenter[];
  private editdeletedisable : boolean;
  private currentVcenter: any = {name: "", ipaddress: "", username: "", password: ""};
  private addVcenter: any = {name: "", ipaddress: "", username: "", password: ""};
  private forEdit: any;
  private test: string = "testing";
  private deletename: string = "";
  private errorheading: string = "";
  private errorMessage: string = "";

  constructor(private vcenterservice: VcenterService){
    this.vcenterservice.getVcenter()
    .subscribe(vcenters => {
      console.log(vcenters);
      this.vcenters = vcenters;
      console.log("this.vcenters -- "+ this.vcenters);
    })
    this.editdeletedisable = true;
  }
  
  ngOnInit(){
    console.log("inside oninit");
    this.editdeletedisable = true;
  }

  ngAfterViewInit() {
     console.log("inside ngAfterViewInit");
     this.vcenterservice.getVcenter()
     .subscribe(vcenters => {
       console.log(vcenters);
       console.log("vcenters --- ",vcenters);
       this.createTable(vcenters);
     })
     $.getScript('assets/wulfdist/js/components/dialog.js');  
     $.getScript('assets/wulfdist/js/components/dlg-wizard.js');  
  }

  createTable(vcenters:any){
    let source =
    {
        localdata: vcenters,
        datafields: [
            {name: 'name', type: 'string'},
            {name: 'ipaddress', type: 'string'},
            {name: 'username', type: 'string'}, 
            {name: 'password',type: 'string'}       
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
          text: 'IP Address/Host Name',
          columntype: 'custom',
	  datafield: 'ipaddress',
	  width: '30%'
      },
      {
          text: 'User Name',
          columntype: 'custom',
	  datafield: 'username',
	  width: '30%'
      },
      {
        text: 'Password',
        columntype: 'custom',
        datafield: 'password',
        hidden: true
      }
     ];
 
    let dataAdapter1 = new (<any> $).jqx.dataAdapter(source, {
    async: false
    });
    (<any>$("#myDiv")).jqxGrid(
      {
        width: 1200,
	height: 375,
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
      //$("#myDiv").jqxGrid("hidecolumn","password");
      
      $("#myDiv").bind('rowselect', (event: any) => {
        let row = event.args.rowindex;
        let datarow = $("#myDiv").jqxGrid('getrowdata', row);
        console.log(datarow);
        this.currentVcenter =  Object.assign({}, datarow);
        this.forEdit = Object.assign({}, datarow);
        this.deletename = datarow.name;
        console.log("currentVcenter --- ",this.currentVcenter);
        this.editdeletedisable = false;
      });
  
     //  (<any> $("#myDiv")).on('rowselect', (event: any) => {
       
     //   let indexes = (<any> $('#myDiv')).jqxGrid('selectedrowindexes');
     //   console.log("indexes =---- ", indexes);
     //   for (let index in indexes) {
     //       let data = (<any> $('#myDiv')).jqxGrid('getrowdata', indexes[index]);
     //       selection[index] = data;
     //       console.log("data ------ ",data);
     //   }
     //   console.log("selection ---- ",selection);
     //   this.currentVcenter =  selection;
     //   this.editdeletedisable = false;
       
     // })
  
  }

  onSelectvcenter(vcenter) {
    this.editdeletedisable = false;
    console.log("clicked........",vcenter);
    this.currentVcenter = Object.assign({}, vcenter);
    this.forEdit = Object.assign({}, vcenter);
    console.log(" currentVcenter --- ", this.currentVcenter);
    console.log(" forEdit --- ", this.forEdit);
    this.deletename = vcenter.name;
  }

  cleanup() {
    console.log("inside cleanup");
    this.currentVcenter.name = "";
    this.currentVcenter.ipaddress = "";
    this.currentVcenter.name = "";
    this.currentVcenter.password = "";
  }

  onRefreshClick() {
    console.log(".maskloader --- ",$(".maskloader"));
    $(".maskloader").show();
    this.vcenterservice.getVcenter()
    .subscribe(vcenters => {
      this.createTable(vcenters);    
    })
    $("#myDiv").jqxGrid('clearselection');
    this.editdeletedisable = true;
    this.cleanup();
    $(".maskloader").hide();
  }
  onAddCancel(){
  	this.addVcenter={name: "", ipaddress: "", username: "", password: ""};
  }
  onAddConfirm(){
    console.log(this.addVcenter.name);
    console.log(this.addVcenter.ipaddress);
    console.log(this.addVcenter.username);
    console.log(this.addVcenter.password);
    if(this.addVcenter.name.trim() == "" || this.addVcenter.ipaddress.trim() == "" || this.addVcenter.username.trim() == "" || this.addVcenter.password.trim() == ""){
      this.errorheading = "Invalid Inputs";
      this.errorMessage = "Please fill out all the mandatory fields";
      $("#addvc").modal('show');
      $("#ErrorDialog").modal('show');
      return;
    } else {
    $(".maskloader").show();
      console.log(this.addVcenter);
      this.vcenterservice.checkVcenter(this.addVcenter)
      .subscribe(result => {
        console.log("resultin com --",result);
        if(result == "ok"){
          $("#addvc").modal('hide');
          this.vcenterservice.addVcenter(this.addVcenter)
          .subscribe(logmsg => {
            console.log("logmsg --- ",logmsg);
						if(logmsg.code == "ER_DUP_ENTRY"){
							this.errorheading = "Add vCenter Failed";
							if(logmsg.sqlMessage.indexOf("PRIMARY") != -1){
								this.errorMessage = "IP Address/ Host already added";
							} else {
								this.errorMessage = "vCenter Name is already available";
							}
							$("#ErrorDialog").modal('show');
							$("#addvc").modal('hide');
						}
            this.addVcenter.name = "";
            this.addVcenter.ipaddress = "";
            this.addVcenter.username = "";
            this.addVcenter.password = "";
            this.onRefreshClick();
          })
        } else {
          console.log("eroor part");
          this.errorheading = "Add vCenter Failed";
		  if(result == "incorrect user name or password"){
            this.errorMessage = "Incorrect Username or Password, Authentication failed";
          } else {
              this.errorMessage = "Not able to reach the server";
          }
          this.addVcenter.name = "";
          this.addVcenter.ipaddress = "";
          this.addVcenter.username = "";
          this.addVcenter.password = "";
          console.log("modal show");
          $("#ErrorDialog").modal('show');
          $("#addvc").modal('hide');
          console.log("after modal");
      }
      $(".maskloader").hide();
      })
    }
  }
  
  onDeleteConfirm() {
    $(".maskloader").show();
    console.log(this.currentVcenter);
    this.vcenterservice.deleteVcenter(this.currentVcenter.name)
    .subscribe(logmsg => {
      console.log(logmsg.affectedRows);
      if(logmsg.affectedRows == 1){
        this.onRefreshClick();
      }
    })
    this.cleanup();
    $(".maskloader").hide();
  }

  onEditCancel(){
    console.log(" forEdit edit --- ", this.forEdit);
    this.currentVcenter = Object.assign({}, this.forEdit);
  }

  onEditConfirm() {
    $(".maskloader").show();
    console.log(" currentVcenter edit --- ", this.currentVcenter);
    console.log(" forEdit edit --- ", this.forEdit);
	this.vcenterservice.checkVcenter(this.currentVcenter).subscribe(result => {
        console.log("resultin com --",result);
        if(result == "ok"){	
			this.vcenterservice.deleteVcenter(this.forEdit.name).subscribe(logmsg => {
				if(logmsg.affectedRows == 1){
					console.log("After delete",this.currentVcenter);
					var temp = {'name':this.currentVcenter.name,'username':this.currentVcenter.username,'password':this.currentVcenter.password,'ipaddress':this.currentVcenter.ipaddress};
					console.log("temp ---- ", temp);
					this.vcenterservice.addVcenter(temp).subscribe(logmsg => {
		
						console.log("After Add");
						this.onRefreshClick();
			            this.cleanup();
					})
				}
			})
			$("#editvc").modal('hide');
		}  else {
          console.log("eroor part");
          this.errorheading = "Add vCenter Failed";
		  if(result == "incorrect user name or password"){
			this.errorMessage = "Incorrect Username or Password, Authentication failed";
		  } else {
	          this.errorMessage = "Not able to reach the server";
		  }
          this.addVcenter.name = "";
          this.addVcenter.ipaddress = "";
          this.addVcenter.username = "";
          this.addVcenter.password = "";
          console.log("modal show");
		  this.onEditCancel();
          $("#ErrorDialog").modal('show');
          $("#editvc").modal('hide');
          console.log("after modal");
      }
	})
	$(".maskloader").hide();
  }
}
