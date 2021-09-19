import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { MapComponent} from './map.component'
declare var window: any;
declare var $:any;

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class DriveComponent implements OnInit, AfterViewInit ,OnChanges{

  loginForm: FormGroup;
  loginForm1: FormGroup;
  submitted = false;
  error = '';token=''
  returnUrl: string;
  id=''
  sendcheck=false;
  year: number = new Date().getFullYear();
  response: any;
  amounts=[];
  amount='';
  status;
  message=""
  info: any;
  // tslint:disable-next-line: max-line-length
  constructor(private modalService: NgbModal,private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
    private authFackservice: AuthfakeauthenticationService) {
      this.id = this.route.snapshot.paramMap.get("id")?this.route.snapshot.paramMap.get("id"):'';
      
     }
     getdc(){
       console.log(1);
       $('.apple-pay-button').show()
      if (window.ApplePaySession) {
        console.log(2)
        var merchantIdentifier = 'merchant.com.filscare.devmerchant';
        var promise = ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier);
        promise.then(function (canMakePayments) {
          console.log(canMakePayments)
          //  if (canMakePayments)
              // Display Apple Pay button here.
      }); 
      }
     }
  ngOnInit() {
    this._fetchData()
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }
  
  public _fetchData() {
    let url='charityDrivePayment?drive_id='+this.id
    if(this.route.snapshot.url['2']=='preview')
      url+='&preview=1'
     this.authFackservice.getv1(url).subscribe(res => {
        if(res['status']==true){
          this.response=res['data'];
          this.status=true;
         if(this.response.payment_type==2){
           this.amounts=this.response.preset_values.split(',');
         }
        }else{
          this.status=false;
          this.message=res['message']
        }
      });
  }
  checkout(item){
    this.amount=item;
    // this.sendcheckout();
  }

  ngAfterViewInit() {
    this.loadStripe();

  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      this.amount=this.loginForm.value.email
     this.sendcheckout()
    }
  }
  showinfo(modal,item){
    this.info=item;
   this.modalService.open(modal,{container: '.account-pages', size: 'sm',windowClass:'modal-holder', centered: true });

  }
  sendcheckout(){
    this.sendcheck=true;
      // let modalRef=this.modalService.open(MapComponent, { size: 'lg',windowClass:'modal-holder', centered: true });
      // modalRef.componentInstance.data ={id:this.id,amount:this.amount};
      // modalRef.componentInstance.passEntry.subscribe(() => {
      //   this._fetchData()
      // })
    // console.log(this.token)
    // let formData=new FormData()
    // formData.append('amount',this.amount);
    // formData.append('drive_id',this.id);
    // this.authFackservice.postMultipartV1('charityDrivePayment',formData).subscribe(
    //   res => {
    //     if(res['status']==true){
    //       window.location.href = res['data'];
    //       }else{
    //       Swal.fire('Error!', res['message'], 'error');
    //     }
    //   });  

  }
  loadStripe() {
    
      //   var m = window.document.createElement("script");
      //   m.id = "jk";
      //   m.type = "text/javascript";
      //   m.textContent ='setTimeout(()=>{ \
      //     var payButton = document.getElementById("pay-button");\
      //   var form = document.getElementById("payment-form");\
      //   Frames.init("pk_test_fb29c2d0-7f3b-4d33-930b-cc4657edbbe1");\
      //   Frames.addEventHandler(\
      //     Frames.Events.CARD_VALIDATION_CHANGED,\
      //     function (event) {\
      //       console.log("CARD_VALIDATION_CHANGED: %o", event);\
      //       payButton.disabled = !Frames.isCardValid();\
      //     }\
      //   );\
      //   Frames.addEventHandler(\
      //     Frames.Events.CARD_TOKENIZED,\
      //     function (event) {\
      //       var el = document.getElementById("success-payment-message")\
      //         el.setAttribute("value", event.token);\
      //     }\
      //   );\
      //   form.addEventListener("submit", function (event) {\
      //    payButton.disabled = true ;// disables pay button once submitted\
      //     event.preventDefault();\
      //     Frames.submitCard();\
      //   }\
      //   )  ,1000} ;  ';
      // window.document.body.appendChild(m);

   
}
ngOnChanges(){
  
}
onLoadPaymentData(event){}
}
