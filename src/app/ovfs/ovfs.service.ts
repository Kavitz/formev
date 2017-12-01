import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class OvfsService{
    constructor(private http:Http){
        console.log('ovftemplate servicr initiasli/...');
	}

	getOvfs(){
	return this.http.get('api/ovfs/'+Math.floor(Math.random()*1000001))
       .map(res => res.json());
	}

    checkovf(newValue :any){
    	return this.http.post('api/checkovf', newValue)
	    .map(res => res.json());
	}
    
    addOvfs(newValue :any){
        return this.http.post('api/ovfs', newValue)
        .map(res => res.json());
	}
	
	getOvfsDetails(name: string){
		console.log("ovfname --- ",name);
		return this.http.get('api/getovfDetails/'+name)
		.map(res => res.json());
	}

	addOvfsDetails(ovfdetails: any){
		return this.http.post('api/ovfDetails', ovfdetails)
		.map(res => res.json());
	}

	deleteOvfs(name: string){
		console.log("name --- ", name)
        return this.http.delete('api/ovfs/'+name)
            .map(res => res.json());
    }
   
	editOvfDetails(name: string, updatedValue: any){
        console.log("updatedValue----",updatedValue);
	    return this.http.put('api/ovfdetails/'+name, updatedValue)
        .map(res => res.json());
    }
}

