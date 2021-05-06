import { Component,Input, OnInit, OnDestroy, ViewChild,  ChangeDetectorRef, Renderer2 } from '@angular/core';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
 
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit, OnDestroy {

  @Input() pro_id: number; // decorate the property with @Input()
 
  message = '';
  messages: any;

  constructor(private authFackservice:AuthfakeauthenticationService, private changeDetectorRef: ChangeDetectorRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.renderer.addClass(document.body, 'no-footer');
    this.getMessages()  
  }
  getMessages(){
    this.authFackservice.get('/payoutComment?payout_id='+this.pro_id)
    .subscribe(res=>{
      if(res['status']==true){
        this.messages=res['data'];
        setTimeout(() => {
        })
      }     
    })
  }
  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'no-footer');
  }






  sendMessage() {
    if (this.message.length > 0) {
      let formData=new FormData();
      formData.append('product_id',this.pro_id.toString());
      formData.append('comment',this.message);

      this.authFackservice.postMultipart('employee/productComment',formData)
      .subscribe(res=>{
        if(res['status']==true){
          this.getMessages();

        }     
      })
    
      this.message = '';
    }
  }

  messageInputKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') { this.sendMessage(); }
  }

  // getCurrentTime(): string {
  //   const now = new Date();
  //   return this.pad(now.getHours(), 2) + ':' + this.pad(now.getMinutes(), 2);
  // }

  pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }
}
