import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

@Injectable()
export class LogService{
	constructor(private http:Http){
        console.log('Log constructor...');
	}
	getLog(){
		return this.http.get('api/getlog/'+Math.floor(Math.random()*1000001))
			.map(res => res.json());
	}
}
