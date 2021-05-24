import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { delay, first } from 'rxjs/operators';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { notificationService } from 'src/app/core/services/notofication.service';
import Swal from 'sweetalert2';
import { NgbdSortableHeader } from '../table-sortable';
import * as htmlToImage from 'html-to-image';

export type SortDirection = 'asc' | 'desc' | '';
export const compare = (v1:number|string, v2:number|string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: string|null;
  direction: SortDirection;
}

@Component({
  selector: 'app-drives',
  templateUrl: './drives.component.html',
})
export class DrivesComponent implements OnInit {
  page={totalElements:0,pageNumber:1,size:10};
  elementCount=0;
  currentpage=1;
  breadCrumbItems: Array<{}>;
  merchantsData:any=[];
  term: any;
  typeValidationForm: FormGroup; 
  typesubmit: boolean=false;
  imageType=true;sizeError=false; logo: any;
  title='Add';
  keyword: string='';
  charities=[];causes=[];
  sortBy='';
  dates=new Date().getTime();
  order='';
  color='#ffff' 
  hrefLink: any;
  blob: Blob;
  qrstring=""
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>=Object.create(null);
  details: any;
   dtToday = new Date();
    img
   month:any = this.dtToday.getMonth() + 1;
   day:any = this.dtToday.getDate();
   year:any = this.dtToday.getFullYear();
  minDate: string;
 
  constructor( private router: Router,private modalService: NgbModal,public notificationService:notificationService,
    private authFackservice: AuthfakeauthenticationService,public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.breadCrumbItems = [{label:'My Dashboard',href:'/dashboard'},{label:'Charitable Drives', active: true }];
    this.currentpage = 1;
    this._fetchData();
    this._getcharities();
    this.initForm();
    if(this.month < 10)
    this.month = '0' + this.month.toString();
    if(this.day < 10)
        this.day = '0' + this.day.toString();

    this.minDate= this.year + '-' + this.month + '-' + this.day;  
  }
  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    if (direction === '') {       this.order='';this.sortBy=''; this._fetchData();

    } else {
      this.order=direction;this.sortBy=column
      this._fetchData();
    }
  } 
  public _getcharities() {
    this.authFackservice.get('/charities').subscribe(
      res => {
        if(res['status']==true){
          this.charities =res['data'];
        }
      });
  }
  public _getcauses(id) {
    this.authFackservice.get('/charityCauses?charity_id='+this.typeValidationForm.value.charity_id).subscribe(
      res => {
        if(res['status']==true){
          this.causes =res['data'];
        }
      });
  } 
  initForm(){
    this.typeValidationForm = this.formBuilder.group({
   
      charity_id:['',Validators.required],
      cause_id:['',Validators.required],
      start_date:['',[Validators.required,this.conditionalDate(this.title)]],
      end_date:['',Validators.required],
      logo_path:['',this.conditionalrequiredValidator(this.title)],
      message:['',Validators.required],
      message2:[''],
      message3:[''],

      heading:['',Validators.required],
      color:['',Validators.required],
      payment_type:['',Validators.required],
      preset_values: this.formBuilder.array([]),
    }, {
      validator: [this.MustHave('payment_type', 'preset_values'),this.mustHigh('start_date', 'end_date')],
    });
    
  }
  checkdate(start,end){
    start=new Date(start).getTime();end=new Date(end).getTime();
    return (start<=this.dates && end>=this.dates)
  }
  conditionalDate(client)
    {
      return (control: AbstractControl):{[key: string]: boolean} | null => {
        if (client=='Edit') return null;
        let currentDateTime = new Date();
        currentDateTime.setHours(0,0,0,0);
        let a=currentDateTime.getTime();
        let controlValue = new Date(control.value);
        controlValue.setHours(0,0,0,0);
        let b=controlValue.getTime();
        if(a>b && control.value)
        {
          return {invalid:true}
        }
      return null;
     
    } 
  }
  deletePhone(i: number) {
    this.phonedata().removeAt(i);
  }
  phone(): FormGroup {
    return this.formBuilder.group({
      phonenumber: ''
    });
  }
  phonedata(): FormArray {
    return this.typeValidationForm.get('preset_values') as FormArray;
  }
  addPhone() {
    this.phonedata().push(this.phone());
  }
  MustHave(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }

        if (control.value==2 && !matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
  }
  mustHigh(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustHigh) {
            return;
        }

        if (control.value>=matchingControl.value) {
            matchingControl.setErrors({ mustHigh: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
  }
  conditionalrequiredValidator(client){      //factory function
    return (control: AbstractControl):{[key: string]: boolean} | null => {
      return (client=="Add"  && (control.value=="" || control.value==null))?{required:true}:null;
    };
  }
  get type() {
    return this.typeValidationForm.controls;
  }
  openQR(largeDataModal: any,item){
    this.qrstring=location.origin+'/merchant/account/drive/'+item;
    this.modalService.open(largeDataModal, { size: 'md',windowClass:'modal-holder', centered: true });

  }
  openModel2(item,largeDataModal: any) {
    this.details=item
     this.modalService.open(largeDataModal, { size: 'lg',windowClass:'modal-holder', centered: true });
   }
  largeModal(largeDataModal: any) {
    this.title='Add';
    this.typesubmit=false;
    this.typeValidationForm.reset();
    this.imageType=true;
    this.sizeError=false;
    this.img=undefined
    this.modalService.open(largeDataModal, { size: 'xl',windowClass:'modal-holder', centered: true });
  }
  onFileSelected(event) {
    if(event.target.files[0].type=='image/png' || event.target.files[0].type=='image/jpg' || event.target.files[0].type=='image/jpeg'){
       this.imageType=true;
    }else{
     this.imageType=false;
      return;
    }if( event.target.files[0].size>2000000){
      this.sizeError=true;
      return;
    }else{
      this.sizeError=false
    }
    var reader = new FileReader();
    reader.onload = (event: ProgressEvent) => {
      this.img = (<FileReader>event.target).result;
    }
    reader.readAsDataURL(event.target.files[0]);
    this.logo=event.target.files[0];
    }
    getamounts(data){
      let amount=[]
      data.forEach(element => {
        amount.push(element.phonenumber);
      });
      return amount;
    }
    downloadQR(){
      // this.authFackservice.setLoader(true).pipe(delay(0)).subscribe(response => {
              htmlToImage.toJpeg(document.getElementsByTagName('canvas')[0])
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'QR.jpeg';
        link.href = dataUrl;
        link.click();
          });
     //   })
        // this.authFackservice.setLoader(false).pipe(delay(0)).subscribe(response => { })

    }
  typeSubmit() {
    this.typesubmit = true;
    if(this.typeValidationForm.status=='INVALID')
    return;
    let amount=[];
    this.typeValidationForm.value.preset_values.forEach(element => {
      amount.push(element.phonenumber);
    });
    var formData: any = new FormData();
    if(this.typeValidationForm.value.logo_path)
    formData.append("logo_path",this.logo);
    formData.append("charity_id", this.typeValidationForm.value.charity_id);
    formData.append("cause_id", this.typeValidationForm.value.cause_id);
    formData.append("start_date", this.typeValidationForm.value.start_date);
    formData.append("end_date", this.typeValidationForm.value.end_date);
    formData.append("message", this.typeValidationForm.value.message);
    formData.append("message2", this.typeValidationForm.value.message2);
    formData.append("message3", this.typeValidationForm.value.message3);

    formData.append("heading", this.typeValidationForm.value.heading);
    formData.append("color", this.typeValidationForm.value.color);
    formData.append("payment_type", this.typeValidationForm.value.payment_type);
    formData.append("preset_values", amount.join(','));    
      this.authFackservice.postMultipart('/charityDrive',formData).subscribe(
        res => {
          if(res['status']==true){
            this._fetchData();
            Swal.fire('Success!', 'New drive has been added.', 'success');
          }else{
            Swal.fire('Error!', res['message'], 'error');
          }
          this.modalService.dismissAll()
        });  
    
  }
  search(){
    this.page.pageNumber=1
    this.currentpage=1;
    this._fetchData()
  }
  public _fetchData() {
    let url='/charityDrive?page='+this.page.pageNumber+'&perPage='+this.page.size+'&keyword='+this.keyword
    if(this.sortBy!='' && this.order!=''){
      url+='&sortBy='+this.sortBy+'&order='+this.order;
    }   
     this.authFackservice.get(url).subscribe(      res => {
        if(res['status']==true){
          this.merchantsData =res['data'];
          this.elementCount=res['elementCount'];
          this.page.totalElements=res['elementCount'];
          this.authFackservice.statuscount() .pipe(first())
          .subscribe(data => {})
        }
      });
  }


  sorting(){
    if(this.sortBy!='' && this.order!=''){
      this._fetchData()
    }
  }
  pageChange(){
    this._fetchData();
  }
  pageCopy(){
    return {...this.page}
 }

 export(type){
   let parameter='payouts'
  this.authFackservice.getFile('/exportData?parameter='+parameter+'&type='+type).subscribe((res:any)=>{
    if(res.type=="application/json"){

    }else if(res.type=="application/vnd.openxmlformats"|| res.type=="text/csv" ){
      this.blob = new Blob([res], {type: res.type});
      var downloadURL = URL.createObjectURL(this.blob);
      //this.sanitizer.bypassSecurityTrustResourceUrl()
      this.hrefLink = downloadURL;
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.setAttribute('href', this.hrefLink);
      link.setAttribute('download', parameter+`.`+type);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
      });

}
  changePage(event){
    this.page.pageNumber=event;
    this._fetchData()
  }

}
