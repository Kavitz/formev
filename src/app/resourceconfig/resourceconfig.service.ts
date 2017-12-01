import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ResourceConfigService{
    constructor(private http:Http){
        console.log('vcente servicr initiasli/...');
	}	
    getResourceConfig(){
		return this.http.get('api/resconf/'+Math.floor(Math.random()*1000001))
		.map(res => res.json());
    }
	getOVFTemplates(){
		return this.http.get('api/ovfs/'+Math.floor(Math.random()*1000001))
		.map(res => res.json());
	}
	getDataCenterForVC(vcenter: any){
		return this.http.post('api/getdatacenter', vcenter)
		.map(res => res.json());	
	}
	getDataStoreForVC(datastore :any){
		console.log("datastore---",datastore);
		return this.http.post('api/getdatastore', datastore)
		.map(res => res.json());
	}
	addResourceConfiguration(newValue :any){
		return this.http.post('api/resconf', newValue)
		.map(res => res.json());
	}
	addResourceConfigurationfile(newValue :any){
		console.log("newValue",newValue);
       	return this.http.post('api/resconffile', newValue)
	    .map(res => res.json());
	}
    deleteResourceConfig(name: string){
		return this.http.delete('api/resconf/'+name)
		.map(res => res.json());
    }
    editResourceConfig(name: string, updatedValue: any){
		console.log("updatedValue----",updatedValue);
		return this.http.put('api/resconf/'+name, updatedValue)
		.map(res => res.json());
    }
}

