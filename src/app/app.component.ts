import { Component } from '@angular/core';
import {notificationService} from './core/services/notofication.service';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { AuthfakeauthenticationService } from './core/services/authfake.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private notifier: NotifierService;
  public pageLoader:boolean=true; 
  loaderSubscription: Subscription;
  
  constructor(public notificationService:notificationService,notifier: NotifierService,private authFackservice: AuthfakeauthenticationService) {
    this.notifier = notifier;

  }
  ngOnInit(){
    this.pageLoader=false;
    this.loaderSubscription=this.authFackservice.getApiLoaderStatus().pipe(delay(0)).subscribe(response => { 
      if(response.show)this.pageLoader=true;
       else this.pageLoader=false;
     });
    this.notificationService.notification.subscribe( (data:any ) => {
      this.showNotification(data);
   })
   
  }
  ngOnDestroy(){
    this.loaderSubscription.unsubscribe();
  }
  
   
   showNotification(data){
    this.notifier.hideOldest();

     this.notifier.notify( data.type, data.message );

   }
}

