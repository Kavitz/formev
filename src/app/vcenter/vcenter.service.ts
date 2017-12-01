import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class VcenterService{
    constructor(private http:Http){
        console.log('vcente servicr initiasli/...');
	}
	
	checkVcenter(newValue :any){
        return this.http.post('api/checkvcenter', newValue)
            .map(res => res.json());
    }
    getVcenter(){
		return this.http.get('api/vcenter/'+Math.floor(Math.random()*1000001))
            .map(res => res.json());
    }
    addVcenter(newValue :any){
    	console.log("newValue --",newValue);
        return this.http.post('api/vcenter', newValue)
        .map(res => res.json());
    }
    deleteVcenter(name: string){
        return this.http.delete('api/vcenter/'+name)
            .map(res => res.json());
    }
    editVcenter(name: string, updatedValue: any){
        console.log("updatedValue----",updatedValue);
        return this.http.put('api/vcenter/'+name, updatedValue)
            .map(res => res.json());
    }
}
