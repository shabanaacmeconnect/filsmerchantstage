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
  selector: 'app-support',
  templateUrl: './support.component.html',
})
export class SupportComponent implements OnInit {
  page={totalElements:0,pageNumber:1,size:10};
  elementCount=0;
  currentpage=1;
  breadCrumbItems: Array<{}>;
  merchantsData:any=[];
  term: any;
  typeValidationForm: FormGroup; // type validation form
  typesubmit: boolean=false;
  
  logo: any;
  title='Add';
  keyword: string='';
  categories=[];
  sortBy='';
  order='';
  hrefLink: any;
  blob: Blob;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>=Object.create(null);

  constructor( private router: Router,private modalService: NgbModal,public notificationService:notificationService,
    private authFackservice: AuthfakeauthenticationService,public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.breadCrumbItems = [{label:'My Dashboard',href:'/dashboard'},{label:'Support', active: true }];
    this.currentpage = 1;
    this._fetchData();
    this._getcategory();
    this.initForm();

  }
  initForm(){
    this.typeValidationForm = this.formBuilder.group({
      subject: ['', [Validators.required]],
      ticket_description: ['', [Validators.required]],
      ticket_category_id:[0,Validators.required],
    });
    
  }
  conditionalrequiredValidator(client){      //factory function
    return (control: AbstractControl):{[key: string]: boolean} | null => {
      return (client=="Add"  && (control.value=="" || control.value==null))?{required:true}:null;
    };
  }
  public _getcategory() {
    this.authFackservice.get('vendor/ticketCategory').subscribe(
      res => {
        if(res['status']==true){
          this.categories =res['data'];
        }
      });
  }
  get type() {
    return this.typeValidationForm.controls;
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
  largeModal(largeDataModal: any) {
    this.title='Add';
    this.typesubmit=false;
    this.typeValidationForm.reset();

    this.modalService.open(largeDataModal, { size: 'lg',windowClass:'modal-holder', centered: true });
  }
  editModal(largeDataModal: any,item) {
    this.typesubmit=false;

    this.title='Edit';
    this.initForm();
        this.typeValidationForm.patchValue({
          subject: item.subject,
          ticket_description:item.ticket_description,
          ticket_category_id:item.ticket_category_id,
         
        });
    this.modalService.open(largeDataModal, { size: 'lg',windowClass:'modal-holder', centered: true });
  }

  typeSubmit() {
    this.typesubmit = true;
    if(this.typeValidationForm.status=='INVALID' )
    return;
    var formData: any = new FormData();
    formData.append("subject", this.typeValidationForm.value.subject);
    formData.append("ticket_category_id", this.typeValidationForm.value.ticket_category_id);
    formData.append("ticket_description", this.typeValidationForm.value.ticket_description);

      // delete data.user_id;
      this.authFackservice.postMultipart('vendor/tickets',formData).subscribe(
        res => {
          if(res['status']==true){
            this._fetchData();
            Swal.fire('Success!', 'New Cuase has been added.', 'success');
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
    let url='vendor/tickets?page='+this.page.pageNumber+'&perPage='+this.page.size+'&keyword='+this.keyword
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

  deleteRow(item){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.authFackservice.delete('vendor/causes?user_id='+item.user_id).subscribe(
          res => {
            if(res['status']==true){
              Swal.fire('Deleted!', 'Selected row has been deleted.', 'success');
              this._fetchData();
            }
          });  
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

  changePage(event){
    this.page.pageNumber=event;
    this._fetchData()
  }

}
