import {  Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { OvfsService } from './ovfs.service';
import { Ovfs } from './ovfs.model';
    
@Component({
  selector: 'vr-Ovfs',
  templateUrl: 'ovfs.component.html'
})

export class OvfsComponent implements AfterViewInit{
  //@ViewChild('ovfstemplatetable') myDiv: ElementRef;
  private pageHeading: string = 'Manage Templates';
  private ovf: Ovfs[];
  private editdeletedisable : boolean;
  private currentOvfs: any = {"ovfname":"","mounturl":"http://slsbem.de.alcatel-lucent.com/pss24loads/archives","build":"1830PSS-23.14-70","valgrind":false,"copylocally":false,"shelfmode":"Sonet","shelftype":"PSS32","commission":"","loopbackip":"","nodetid":"","bootlevel":""};
  private addOvfs: any = {"name":"",url:""};
  private forEdit: any;
  private deletename: string = "";
  private editname: string = "";
  private errorheading: string = "";
  private errorMessage: string = "";

  constructor(private ovfsservice: OvfsService){
    this.editdeletedisable = true;
  }
  
  ngOnInit() {
    console.log("inside oninit");
    this.editdeletedisable = true;
  }

  ngAfterViewInit() {
    console.log("inside ngAfterViewInit");
    this.ovfsservice.getOvfs()
    .subscribe(ovf => {
      console.log(ovf);
      console.log("ovf --- ",ovf);
      this.createTable(ovf);
    })
    $.getScript('assets/wulfdist/js/components/dialog.js');  
    $.getScript('assets/wulfdist/js/components/dlg-wizard.js');  
  }

  createTable(ovf:any){
    var source = {
        localdata: ovf,
        datafields: [
            {name: 'name', type: 'string'},
            {name: 'product', type: 'string'},
            {name: 'version', type: 'string'},
            {name: 'url', type: 'string'},
                
        ],
        datatype: "array",
        sortcolumn: 'name',
        sortdirection: 'asc'
    };
    var columns = [
      {
          text: 'Name',
          columntype: 'custom',
          datafield: 'name',
          width: 350,
          minWidth: 200
      },
      {
          text: 'Product',
          columntype: 'custom',
          datafield: 'product',
          width: 350,
          minWidth: 200
      },
      {
        text: 'Version',
        columntype: 'custom',
        datafield: 'version',
        width: 350,
        minWidth: 200
      },
      {
      text: 'URL',
      columntype: 'custom',
      datafield: 'url',
      width: 350,
      minWidth: 200
      }
    ];
 
    var dataAdapter1 = new (<any> $).jqx.dataAdapter(source, {
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
      rowsheight: 26,
      columnsheight: 26,
      handlekeyboardnavigation: function (e) {
        return $.grid.handlekeyboardnavigation(e);
      }
    });
      $("#myDiv").jqxGrid("hidecolumn","url");     
      $("#myDiv").bind('rowselect', (event: any) => {
        let row = event.args.rowindex;
        console.log("row selected");
        let datarow = $("#myDiv").jqxGrid('getrowdata', row);
		    console.log(datarow);
		    this.onSelectRow(datarow);
        this.editdeletedisable = false;
      });
	} 

	onSelectRow(Ovfs){
    console.log("insdie slect row ------------ ",Ovfs.name);
    this.ovfsservice.getOvfsDetails(Ovfs.name)
    .subscribe(logmsg => {
      console.log("logmsg --- ",logmsg);
      this.currentOvfs = Object.assign({},logmsg[0]);
      this.forEdit = Object.assign({},logmsg[0]);
      console.log("clicked........",Ovfs);
      console.log(" currentOvfs --- ", this.currentOvfs);
      console.log(" forEdit --- ", this.forEdit);
    });  
    this.deletename = Ovfs.name;
   }

  cleanup() {
    console.log("inside cleanup");
    // this.currentOvfs.name = "";
    // this.currentOvfs.product = "";
    // this.currentOvfs.version = "";
    // this.currentOvfs.url = "";
  }

  onRefreshClick() {
    console.log(".maskloader --- ",$(".maskloader"));
    $(".maskloader").show();
    this.ovfsservice.getOvfs()
    .subscribe(ovf => {
      this.createTable(ovf);    
    })
    $("#myDiv").jqxGrid('clearselection');
    this.editdeletedisable = true;
    this.cleanup();
    $(".maskloader").hide();
  }

  onAddCancel(){
  	this.addOvfs={"name":"",url:""};
  }
  onAddConfirm(){
  	let ovfname = this.addOvfs.name;
    if(this.addOvfs.name.trim() == "" ||  this.addOvfs.url.trim() == ""){
      this.errorheading = "Invalid Inputs";
      this.errorMessage = "Please fill out all the mandatory fields";
      $("#addovf").modal('show');
      $("#ErrorDialog").modal('show');
      return;
	} else if((this.addOvfs.url.indexOf("mnt/") == -1) && (this.addOvfs.url.indexOf("virtual1830.de.alcatel-lucent.com") == -1)){
	  	this.errorheading = "Invalid Inputs";
		this.errorMessage = "Please enter valid url";
		$("#addovf").modal('show');
     	$("#ErrorDialog").modal('show');
		return;
	} else {
		$(".maskloader").show();
      	this.ovfsservice.checkovf(this.addOvfs).subscribe(result => {
        console.log("resultin com --",typeof(result));
        if(result == true){
		  let  url = this.addOvfs.url;
          console.log(url);
          let urlsplit=url.split("/");
          let splittedurl=urlsplit[urlsplit.length-2];
          let product=splittedurl.split("-");
          let productname=product[1];
          let version=product.splice(2).join(".");
          let temp = {name: this.addOvfs.name, product: productname, version: version, url: this.addOvfs.url};
          console.log(temp);
          this.ovfsservice.addOvfs(temp)
          .subscribe(logmsg => {
            console.log("logmsg --- ",logmsg);
            if(logmsg.code == "ER_DUP_ENTRY"){
              this.errorheading = "Add OVF Failed";
              if(logmsg.sqlMessage.indexOf("PRIMARY") != -1){
                this.errorMessage = "URL already added";
              } else {
                this.errorMessage = "Name is already available for another OVF";
              }
              $("#ErrorDialog").modal('show');
              $("#addovf").modal('hide');
            }
            else {
              let initialvalues = {"ovfname": this.addOvfs.name,"mounturl":"http://slsbem.de.alcatel-lucent.com/pss24loads/archives","build":"1830PSS-23.14-70","valgrind":false,"copylocally":false,"shelfmode":"Sonet","shelftype":"PSS32","commission":false,"loopbackip":"","nodetid":"n1","bootlevel":""};
              this.ovfsservice.addOvfsDetails(initialvalues)
              .subscribe(logmsg => {
                console.log("logmsg --- ",logmsg);
              });
              $("#addovf").modal('hide');
            }
            this.addOvfs.name = "";
            this.addOvfs.url = "";
            this.onRefreshClick();
          });
        } else {
          console.log("eroor part");
          this.errorheading = "Add OVF Failed";
          this.errorMessage = "Not able to reach the url";
          this.addOvfs.name = "";
          this.addOvfs.url = "";
          console.log("modal show");
          $("#ErrorDialog").modal('show');
          $("#addovf").modal('hide');
          console.log("after modal");
        }
        $(".maskloader").hide();
		  })
    }
}
      
  onDeleteConfirm() {
    $(".maskloader").show();
    console.log(this.currentOvfs);
    this.ovfsservice.deleteOvfs(this.deletename)
    .subscribe(logmsg => {
      console.log(logmsg.affectedRows);
      if(logmsg.affectedRows == 1){
        this.onRefreshClick();
      }
    })
    this.cleanup();
    $(".maskloader").hide();
  }

  onEditConfirm() {
     $(".maskloader").show();
     console.log(" currentOvfs edit --- ", this.currentOvfs);
     console.log(" forEdit edit --- ", this.forEdit);
     this.ovfsservice.editOvfDetails(this.currentOvfs.ovfname,this.currentOvfs)
     .subscribe(logmsg => {
       console.log("logmsg ---- ",logmsg);
     })
  }
  //   if(this.currentOvfs.name != this.forEdit.name){
  //     console.log("this.currentOvfs.name --- ",this.currentOvfs.name);
  //     this.ovfsservice.deleteOvfs(this.forEdit.name)
  //     .subscribe(logmsg => {
  //       console.log(this.currentOvfs);
  //       console.log(logmsg.affectedRows);
  //       if(logmsg.affectedRows == 1){
  //         console.log("inside after delete this.currentOvfs -- ",this.currentOvfs.name);
  //         this.ovfsservice.addOvfs(this.currentOvfs)
  //           .subscribe(logmsg => {
  //             console.log(logmsg);
  //             this.onRefreshClick();
  //             this.cleanup();
  //           })
  //       }
  //     })
  //   } else {
  //     this.ovfsservice.editOvfs(this.currentOvfs.name,this.currentOvfs)
  //       .subscribe(logmsg => {
  //         console.log(logmsg);
  //         if(logmsg == "updated"){
  //           this.onRefreshClick();
  //           this.cleanup();
  //         }
  //       })
  //   }
  //   $(".maskloader").hide();
  // }
}
    
