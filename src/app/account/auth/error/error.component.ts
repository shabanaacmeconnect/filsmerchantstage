import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { environment } from '../../../../environments/environment';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
})

/**
 * Login component
 */
export class ErrorComponent implements OnInit {
  id=''
  drive=''
  response: any;
  response1:any;
  status;
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
    private authFackservice: AuthfakeauthenticationService) {
      this.id = this.route.snapshot.paramMap.get("id")?this.route.snapshot.paramMap.get("id"):'';
      this.drive = this.route.snapshot.paramMap.get("drive")?this.route.snapshot.paramMap.get("drive"):'';

     }

  ngOnInit() {
      this._fetchData()
  }
  public _fetchData() {
  this.authFackservice.get('charityDrivePayment?drive_id='+this.drive).subscribe(res => {
       if(res['status']==true){
         this.status=true
        this.response1=res['data'][0];
       }
      })
    let url='/transactionDetails?transaction_id='+this.id
    
     this.authFackservice.get(url).subscribe(res => {
        if(res['status']==true){
          this.status=true;
         this.response=res['data'][0];
        
        }
      });
  }
  
}
