import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { notificationService } from 'src/app/core/services/notofication.service';
import { NgbdSortableHeader } from '../table-sortable';
import { first } from 'rxjs/operators';

export type SortDirection = 'asc' | 'desc' | '';
export const compare = (v1:number|string, v2:number|string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: string|null;
  direction: SortDirection;
}
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
})

/**
 * Ecomerce merchants component
 */
export class NotificationsComponent implements OnInit {
  page={totalElements:0,pageNumber:1,size:10};
  countries=[];
  categories=[];
  sortBy='';
  order='';
  closed=true;
  elementCount=0;
  currentpage=1;
  breadCrumbItems: Array<{}>;
  typeValidationForm: FormGroup; // type validation form
  typesubmit: boolean=false;
  merchantsData:any=[];
  hrefLink: any;
  blob: Blob;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>=Object.create(null);

  title='Add';
  keyword: string='';
  constructor( private router: Router,private modalService: NgbModal,public notificationService:notificationService,
    private authFackservice: AuthfakeauthenticationService,public formBuilder: FormBuilder) { }

  ngOnInit() {
     this.breadCrumbItems = [{label:'My Dashboard',href:'/dashboard'},{ label: 'Notifications', active: true }];
   
    this._fetchData();
  }
 
  search(){
    this.page.pageNumber=1
    this.currentpage=1;
    this._fetchData()
  }

  public _fetchData(type=null) {
   
    let url='/notifications?page='+this.page.pageNumber+'&perPage='+this.page.size+'&keyword='+this.keyword
    if(this.sortBy!='' && this.order!=''){
      url+='&sortBy='+this.sortBy+'&order='+this.order;
    }
    if(type==1){
      this.authFackservice.getnoload(url).subscribe(
        res => {
          if(res['status']==true){
            this.merchantsData =res['data'];
            this.elementCount=res['elementCount'];
            this.page.totalElements=res['elementCount'];
  
          }
        });
    }else{
      this.authFackservice.statuscount().pipe(first())
      .subscribe(data => {})
      this.authFackservice.get(url).subscribe(
        res => {
          if(res['status']==true){
            this.merchantsData =res['data'];
            this.elementCount=res['elementCount'];
            this.page.totalElements=res['elementCount'];
  
          }
        });
    }
    
  }
  clearAll(type){
    this.authFackservice.put('/notifications?type='+type+'&page='+this.page.pageNumber+'&perPage='+this.page.size,{}).subscribe(
      res => {
        if(res['status']==true){
          this._fetchData()
        }
      })
  }
  clearone(id){
    this.authFackservice.delete('/notifications?notification_id='+id).subscribe(
      res => {
        if(res['status']==true){
          this.closed=false;
          setTimeout(()=>{this.closed=true;},3000)
          this._fetchData(1)        }
      })
  }
  toggleFunction(event,id){
    let currentTarget=event.currentTarget.checked==true?0:1;
    let text='Are you sure to Disable';let confirmButtonText='Yes. Disable it!'
    if(currentTarget==0){
      text='Are you sure to enable'; confirmButtonText='Yes. Enable it!'
    }
    Swal.fire({
      title: 'Are you sure?',
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: confirmButtonText
    }).then(result => {
      if (result.value) {
      this.authFackservice.put('/categories/status?value='+currentTarget+'&category_id='+id,{}).subscribe(
        res => {
          if(res['status']==true){
            if(currentTarget==0)
            Swal.fire('Enabled!', 'Selected notification has been enaled.', 'success');
            else
            Swal.fire('Disabled!', 'Selected notification has been disabled.', 'success');
            this._fetchData();
          }
        });  
    }else this._fetchData();
    })
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
