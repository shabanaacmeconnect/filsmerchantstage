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
  selector: 'app-payout',
  templateUrl: './payout.component.html',
})
export class PayoutComponent implements OnInit {
  page={totalElements:0,pageNumber:1,size:10};
  elementCount=0;
  currentpage=1;
  breadCrumbItems: Array<{}>;
  merchantsData:any=[];
  term: any;
  typeValidationForm: FormGroup; // type validation form
  typesubmit: boolean=false;
 
  title='Add';
  keyword: string='';
  categories=[];
  sortBy='';
  order='';
  id=''
  hrefLink: any;
  blob: Blob;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>=Object.create(null);
  attachments: any;
  details: any;

  constructor( private router: Router,private modalService: NgbModal,public notificationService:notificationService,
    private authFackservice: AuthfakeauthenticationService,public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.breadCrumbItems = [{label:'My Dashboard',href:'/dashboard'},{label:'Payout', active: true }];
    this.currentpage = 1;
    this._fetchData();
    this._getcategory();
    this.initForm();

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
  initForm(){
    this.typeValidationForm = this.formBuilder.group({
   
      payout_amount:['',Validators.required],
      transaction_mode:['',Validators.required],
    });
    
  }

  public _getcategory() {
    this.categories=['Cash','Bank','Credit Card']
    // this.authFackservice.get('/categoryList').subscribe(
    //   res => {
    //     if(res['status']==true){
    //       this.categories =res['data'];
    //     }
    //   });
  }
  get type() {
    return this.typeValidationForm.controls;
  }
  largeModal(largeDataModal: any) {
    this.title='Add';
    this.typesubmit=false;
    this.typeValidationForm.reset();
   
    this.modalService.open(largeDataModal, { size: 'md',windowClass:'modal-holder', centered: true });
  }
  getattachmentlist(){
    this.authFackservice.get('/payoutAttachment?payout_id='+this.id).subscribe(
      res => {
        if(res['status']==true){
          this.attachments =res['data'];
        }
      });
  }
  typeSubmit() {
    this.typesubmit = true;
    if(this.typeValidationForm.status=='INVALID')
    return;
    var formData: any = new FormData();
    formData.append("transaction_mode", this.typeValidationForm.value.transaction_mode);
    formData.append("payout_amount", this.typeValidationForm.value.payout_amount);
    let data=this.typeValidationForm.value;
    
      this.authFackservice.postMultipart('/payouts',formData).subscribe(
        res => {
          if(res['status']==true){
            this._fetchData();
            Swal.fire('Success!', 'New payout has been added.', 'success');
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
    let url='/payouts?page='+this.page.pageNumber+'&perPage='+this.page.size+'&keyword='+this.keyword
    if(this.sortBy!='' && this.order!=''){
      url+='&sortBy='+this.sortBy+'&order='+this.order;
    }   
     this.authFackservice.get(url).subscribe(      res => {
        if(res['status']==true){
          this.merchantsData =res['data'];
          this.elementCount=res['elementCount'];
          this.page.totalElements=res['elementCount'];
          this.authFackservice.statuscount().pipe(first())
          .subscribe(data => {})
        }
      });
  }
  openModel2(item,largeDataModal: any) {
    this.details=item
     this.modalService.open(largeDataModal, { size: 'lg',windowClass:'modal-holder', centered: true });
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
  openModel(largeDataModal: any,id) {
    this.id=id;
    this.modalService.open(largeDataModal, { size: 'lg',windowClass:'modal-right', centered: false,backdropClass:'modal-right' });
  }
  getAttachments(largeDataModal: any,id){
    this.id=id;
    this.getattachmentlist()
    this.modalService.open(largeDataModal, { size: 'lg',windowClass:'modal-right', centered: false,backdropClass:'modal-right' }); 
  }
  onFileSelected(event) {
    if(event.target.files[0].type=='image/png' || event.target.files[0].type=='image/jpg' || event.target.files[0].type=='image/jpeg'){
     
   }else{
    let message={type:"error",message:"Please select a valid image file"}
    this.notificationService.notification.emit(message);
     return;
   }if( event.target.files[0].size>2000000){
    let message={type:"error",message:"Please select a image file < 2 MB"}
    this.notificationService.notification.emit(message);
     return;
   }
    var formData: any = new FormData();
    formData.append("attachments", event.target.files[0]);
    formData.append("offer_id", this.id);

    this.authFackservice.postMultipart('agency/offerChargeAttachment',formData)
    .subscribe(resp=>{
      if(resp['status']==true){
       this.getattachmentlist();
      }else{

      }
     
    })

  }
  
  selectFile(){
    document.getElementById('file').click();
    }
}
