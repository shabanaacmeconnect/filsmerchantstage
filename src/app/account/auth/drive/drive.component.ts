import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { environment } from '../../../../environments/environment';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class DriveComponent implements OnInit, AfterViewInit {

  loginForm: FormGroup;
  submitted = false;
  error = '';
  returnUrl: string;
  id=''
  // set the currenr year
  year: number = new Date().getFullYear();
  response: any;
  amounts=[];
  amount='';
  status;
  message=""
  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
    private authFackservice: AuthfakeauthenticationService) {
      this.id = this.route.snapshot.paramMap.get("id")?this.route.snapshot.paramMap.get("id"):'';

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
          this.status=true
         this.response=res['data'][0];
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
    this.sendcheckout();
  }

  ngAfterViewInit() {
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
  sendcheckout(){
    let formData=new FormData()
    formData.append('amount',this.amount);
    formData.append('drive_id',this.id);
    this.authFackservice.postMultipartV1('charityDrivePayment',formData).subscribe(
      res => {
        if(res['status']==true){
          window.location.href = res['data'];
          }else{
          Swal.fire('Error!', res['message'], 'error');
        }
      });  

  }
}
