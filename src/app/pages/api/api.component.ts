import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./faqs.component.scss']
})

/**
 * Utility FAQs component
 */
export class ApiComponent implements OnInit {
  api_key='';api_secret='';
  keypresent:any=[];
    breadCrumbItems: Array<{}>;
  success={
    "status": true,
    "data": "",
    "message": "success"
}
form1=false;
form2=false;
error={
  "status": true,
  "data": "",
  "message": "No reciept found."
}
  constructor( private authFackservice: AuthfakeauthenticationService) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Utility' }, { label: 'FAQs', active: true }];
    this.getKeys()
  }
  getKeys(){
    this.authFackservice.get('vendor/apiSettings').subscribe(
      res => {
        if(res['status']==true){
          this.keypresent=res['data'];
         if(res['data']!=[]){
           this.form1=false;
           this.form2=true;
           this.api_secret=res['data'][0]['api_secret']
         }
        }
      });
  }
  copyInputMessage(item){
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }
  generateKeys(){
    this.authFackservice.get('vendor/generateApiKey').subscribe(
      res => {
        if(res['status']==true){
          this.keypresent=res['data']
          this.form1=true;
          this.form2=false;
          this.api_key=res['data']['api_key'];
          this.api_secret=res['data']['api_secret'];
          Swal.fire('Success!', 'Api Keys generated successfully.Please copy them for use', 'success');
        }else{
          Swal.fire('Error!', res['message'], 'error');
        }
      });
  }
  dailysubmit(form){
    if(!form.valid ){
      return;
    }
    var formData: any = new FormData();
      formData.append("api_secret", this.api_secret);
      formData.append("api_key", this.api_key);
      this.authFackservice.putMultipart('vendor/apiSettings',formData).subscribe(
        res => {
          if(res['status']==true){
            Swal.fire('Success!', 'Api Details Updated.', 'success');
          }else{
            Swal.fire('Error!', res['message'], 'error');
          }
        });
   
    }
}
