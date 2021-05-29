import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { notificationService } from 'src/app/core/services/notofication.service';
import { first } from 'rxjs/operators';
export type SortDirection = 'asc' | 'desc' | '';
export const compare = (v1:number|string, v2:number|string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: string|null;
  direction: SortDirection;
}
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})

/**
 * Ecomerce merchants component
 */
export class SettingsComponent implements OnInit {
  page={totalElements:0,pageNumber:1,size:10};
  countries=[];
  categories=[];
  sortBy='';
  order='';
  @ViewChild('form') form: NgForm;
  img='';
  form1=false;
  form2=false;
  // bread crumb items
  elementCount=0;
  currentpage=1;
  breadCrumbItems: Array<{}>;
  typeValidationForm: FormGroup; // type validation form
  typesubmit: boolean=false;
  merchantsData:any=[];
  api_key='';api_secret='';
  keypresent:any=[]
  title='Add';
  keyword: string='';
  constructor( private router: Router,private modalService: NgbModal,public notificationService:notificationService,
    private authFackservice: AuthfakeauthenticationService,public formBuilder: FormBuilder) { }

  ngOnInit() {
     this.breadCrumbItems = [{label:'My Dashboard',href:'/dashboard'},{ label: 'Settings', active: true }];
   
    this.initForm();
    this._fetchData();
  }
  initForm(){
    this.typeValidationForm = this.formBuilder.group({
      current_password:['',Validators.required],
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
  search(){
    this.page.pageNumber=1
    this.currentpage=1;
    this._fetchData()
  }

  public _fetchData() {
  
    let url='/getDetails'
    this.authFackservice.get(url).subscribe(
      res => {
        if(res['status']==true){
          this.merchantsData =res['data'][0];
        }
      });
      this.authFackservice.get('/apiSettings').subscribe(
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
        this.authFackservice.statuscount().pipe(first())
        .subscribe(data => {})
  }
  get type() {
    return this.typeValidationForm.controls;
  }
  editModal(largeDataModal: any) {
    this.typesubmit=false;
    this.initForm();
   this.modalService.open(largeDataModal, { size: 'lg',windowClass:'modal-holder', centered: true });
  }
  imageModal(largeDataModal: any,img) {
   this.img=img;
   this.modalService.open(largeDataModal, { size: 'lg',windowClass:'modal-holder', centered: true });
  }
  typeSubmit() {
    this.typesubmit = true;
    if(this.typeValidationForm.status=='INVALID')
    return;
    var formData: any = new FormData();
    formData.append("current_password", this.typeValidationForm.value.current_password);
    formData.append("new_password", this.typeValidationForm.value.new_password);
    formData.append("confirm_password", this.typeValidationForm.value.confirm_password);
    this.authFackservice.postMultipart('api/changePassword',this.typeValidationForm.value).subscribe(
      res => {
        if(res['status']==true){
          Swal.fire('Success!', 'Password has been changed.', 'success');
          this.modalService.dismissAll()
          this.authFackservice.logout()
        }else{
          Swal.fire('Error!', res['message'], 'error');

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
    this.authFackservice.get('/generateApiKey').subscribe(
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
      this.authFackservice.putMultipart('/apiSettings',formData).subscribe(
        res => {
          if(res['status']==true){
            Swal.fire('Success!', 'Api Details Updated.', 'success');
          }else{
            Swal.fire('Error!', res['message'], 'error');
          }
        });
   
    }
}
