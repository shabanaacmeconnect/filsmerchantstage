import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { notificationService } from 'src/app/core/services/notofication.service';
import Swal from 'sweetalert2';
import { NgbdSortableHeader } from '../table-sortable';

export type SortDirection = 'asc' | 'desc' | '';
export const compare = (v1:number|string, v2:number|string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: string|null;
  direction: SortDirection;
}


@Component({
  selector: 'app-charity',
  templateUrl: './charity.component.html',
})

/**
 * Ecomerce merchants component
 */
export class CharityComponent implements OnInit {
  page={totalElements:0,pageNumber:1,size:10};
  charities=[];
  causes=[];
  sortBy='';
  order='';
  category='';
  // bread crumb items
  elementCount=0;
  currentpage=1;
  breadCrumbItems: Array<{}>;
  typeValidationForm: FormGroup; // type validation form
  typesubmit: boolean=false;
  merchantsData:any=[];
  term: any;
  charity='';assigned:any
  cause='';
  categories=[]
  imageType=true; imageType1=true; imageType2=true; imageType3=true;
  sizeError=false; sizeError1=false;sizeError2=false;sizeError3=false;
    logo: any; logo1: any; logo2: any; logo3: any;
    hrefLink: any;
  blob: Blob;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>=Object.create(null);
    title='Add';
  keyword: string='';
  constructor( private router: Router,private modalService: NgbModal,public notificationService:notificationService,
    private authFackservice: AuthfakeauthenticationService,public formBuilder: FormBuilder) { }

  ngOnInit() {
     this.breadCrumbItems = [{label:'My Dashboard',href:'/dashboard'},{ label: 'Merchants', active: true }];
    this.currentpage = 1;
    this._getcharities();
    this.getcategories();
    this.initForm();
    this._fetchData();
   this.assign();
  }
  initForm(){
    this.typeValidationForm = this.formBuilder.group({
      cause_id: ['', [Validators.required]],
      charity_id:['',[Validators.required]],
     
    });
    
  }
 
 assign(){
  this.authFackservice.get('/assignedCharityCause').subscribe(
    res => {
      if(res['status']==true){
        if(res['data']!=[]){
          this.charity=res['data'][0].assigned_charity_id,
           this.cause=res['data'][0].assigned_cause_id,
           this.assigned=res['data'][0]
           this.typeValidationForm.patchValue({
            charity_id:this.charity,
          })
          this._getcauses(res['data'][0].assigned_charity_id);
          this.typeValidationForm.patchValue({
            cause_id:this.cause,
          })
        }
      }
    });
 }
 onSort({column, direction}: SortEvent) {
  // resetting other headers
  this.headers.forEach(header => {
    if (header.sortable !== column) {
      header.direction = '';
    }
  });
  if (direction === '') { this._fetchData();
    this.order='';this.sortBy=''
  } else {
    this.order=direction;this.sortBy=column
    this._fetchData();
  }
}  
  search(){
    this.page.pageNumber=1
    this.currentpage=1;
    this._fetchData()
  }
  public getcategories() {
    this.authFackservice.get('/categoryList').subscribe(
      res => {
        if(res['status']==true){
          this.categories =res['data'];
        }
      });
  }
  
  public _getcharities() {
    this.authFackservice.get('/charities').subscribe(
      res => {
        if(res['status']==true){
          this.charities =res['data'];
          this.authFackservice.statuscount().pipe(first())
          .subscribe(data => {})
        }
      });
  }
  public _getcauses(id,ob=null) {
    this.typeValidationForm.patchValue({
      cause_id:'',
    })
    this.authFackservice.get('/charityCauses?charity_id='+this.typeValidationForm.value.charity_id).subscribe(
      res => {
        if(res['status']==true){
          this.causes =res['data'];
        }
      });
  }
  public _fetchData() {
    let url='/charities?page='+this.page.pageNumber+'&perPage='+this.page.size+'&keyword='+this.keyword
    if(this.sortBy!='' && this.order!=''){
      url+='&sortBy='+this.sortBy+'&order='+this.order;
    }
    if(this.category!=''){
      url+='&category_id='+this.category;
    }
    this.authFackservice.get(url).subscribe(
      res => {
        if(res['status']==true){
          this.merchantsData =res['data'];
          this.elementCount=res['elementCount'];
          this.page.totalElements=res['elementCount'];

        }
      });
  }
  get type() {
    return this.typeValidationForm.controls;
  }
  largeModal(largeDataModal: any) {
    this.title='Add';
    this.typesubmit=false;
    this.typeValidationForm.reset();
    this.typeValidationForm.patchValue({
      charity_id:this.charity,
      cause_id:this.cause
    });
    this.modalService.open(largeDataModal, { size: 'md',windowClass:'modal-holder', centered: true });
  }

  typeSubmit() {
    this.typesubmit = true;
    if(this.typeValidationForm.status=='INVALID')
    return;
    var formData: any = new FormData();
    formData.append("charity_id", this.typeValidationForm.value.charity_id);
    formData.append("cause_id", this.typeValidationForm.value.cause_id);
    
    if(this.charity!='' && this.cause!='' && this.cause!=this.typeValidationForm.value.cause_id){
      let a=this.charities.filter(x=>{return x.user_id== this.typeValidationForm.value.charity_id})
      let b=this.causes.filter(x=>{return x.id== this.typeValidationForm.value.cause_id})
      Swal.fire({
        title: 'Are you sure?',
        text: 'Would you like to change the charity and cause to '+a[0].business_name+' - '+b[0].cause_name,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Yes!'
      }).then(result => {
        if (result.value) {
          this.authFackservice.putMultipart('/assignCharityCause',formData).subscribe(
            res => {
              if(res['status']==true){
                this.assign();
                Swal.fire('Success!', 'Selected cause has been configured.', 'success');
    
              }else{
                Swal.fire('Error!', res['message'], 'error');
              }
              this.modalService.dismissAll()
            }); 
        }
      })
    }else if( this.cause!=this.typeValidationForm.value.cause_id){
      this.authFackservice.putMultipart('/assignCharityCause',formData).subscribe(
          res => {
            if(res['status']==true){
              this.assign();
              Swal.fire('Success!', 'Selected cause has been configured.', 'success');
            }else{
              Swal.fire('Error!', res['message'], 'error');
            }
            this.modalService.dismissAll()
      }); 
    }else               this.modalService.dismissAll()

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
   let parameter='charities'
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
