import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'vr-login',
  templateUrl: 'login.component.html'
})

export class LoginComponent implements AfterViewInit{
    constructor(private router: Router){    
    }
	ngAfterViewInit(): void {
    }
    redirect() {
        this.router.navigate(['home']);
    }
}
