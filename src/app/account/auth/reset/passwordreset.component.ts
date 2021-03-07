import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})

/**
 * Reset-password component
 */
export class ResetComponent implements OnInit, AfterViewInit {

  resetForm: FormGroup;
  typeValidationForm: FormGroup; // type validation form

  typesubmit = false;
  error = '';
  success = '';
  loading = false;
  id=''
  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private authFackservice: AuthfakeauthenticationService,private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("token")?this.route.snapshot.paramMap.get("token"):'';

    this.typeValidationForm = this.formBuilder.group({
      new_password: ['', [Validators.required, Validators.minLength(10),Validators.pattern('^(?=(.*[a-zA-Z]){1,})(?=(.*[!@#$%^&*()_+|~=\`<{}:;’>?,./\"]){1,})(?=(.*[0-9]){1,}).{1,}$')]],
      confirm_password: ['',Validators.required],
    }, {
        validator: this.MustMatch('new_password', 'confirm_password'),
      });
  }
  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
  }
  ngAfterViewInit() {
  }

  // convenience getter for easy access to form fields
  get type() { return this.typeValidationForm.controls; }

  /**
   * On submit form
   */
  typeSubmit() {
    this.typesubmit = true;
    if(this.typeValidationForm.status=='INVALID')
    return;
    if(!this.id){
      this.error="Invalid Token";
      return;
    }
    this.authFackservice.resetPassword(this.typeValidationForm.value.new_password,this.typeValidationForm.value.confirm_password,this.id)
    .pipe(first())
    .subscribe(
      data => {
        if(data.status==true){
            this.router.navigate(['/account/login']);
        }
        else
        this.error = data.message;
      },
      error => {
        
      });
  }
 
}
