import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }



  partner_load() {
    this.router.navigate(['partner/load']); 
  }

}
