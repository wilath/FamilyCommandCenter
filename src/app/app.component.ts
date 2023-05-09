import { Component, ElementRef, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent   {
  title =  "Family ToDo";
  show: boolean = false;
  showMenu:boolean = true 
  isSmallScreen:boolean = false
  posStyle = 'fixed'


  constructor(private breakpointObserver: BreakpointObserver) {

    this.breakpointObserver.observe(['(max-width: 1350px)']).subscribe(result => {
      this.isSmallScreen = result.matches;
      this.showMenu = !result.matches
      if(result.matches){this.posStyle = 'absolute'}else{this.posStyle = 'fixed'}
      
    });
    
   }
   changePos(){
    this.posStyle = this.posStyle === 'fixed' ? 'absolute' : 'fixed';

   }

 

}




