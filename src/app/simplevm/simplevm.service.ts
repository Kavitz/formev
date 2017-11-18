import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';


@Injectable()
export class SimpleVMService{
    constructor(private http:Http){
        console.log('vcente servicr initiasli/...');
	}
    getResource(){
        return this.http.get('api/getConfigList')
            .map(res => res.json());
    }
    deployVM(deployproperties: any){
        return this.http.post('api/deployVM',deployproperties)
            .map(res => res.json());
    }
}