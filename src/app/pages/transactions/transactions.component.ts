import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { notificationService } from 'src/app/core/services/notofication.service';
import Swal from 'sweetalert2';
import { Observable, Subscription } from 'rxjs';
import { TransactionsService } from './transactions.service';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { NgbdSortableHeader } from '../table-sortable';
import { first } from 'rxjs/operators';

export type SortDirection = 'asc' | 'desc' | '';
export const compare = (v1:number|string, v2:number|string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: string|null;
  direction: SortDirection;
}


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnInit {
  from_date ;
  to_date;
  socket;
  hrefLink: any;
  blob: Blob;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>=Object.create(null);

  document: any;
  page={totalElements:0,pageNumber:1,size:10};
  elementCount=0;
  currentpage=1;
  breadCrumbItems: Array<{}>;
  merchantsData:any=[];
  keyword: string='';
  term=""
  sortBy='';
  order='';
  details: any;
  transfer_type: any;
  constructor(private socketService: TransactionsService, private router: Router,private modalService: NgbModal,public notificationService:notificationService,
    private authFackservice: AuthfakeauthenticationService,public formBuilder: FormBuilder) { }
   ngOnInit() {
    // this.setupSocketConnection();
    this.breadCrumbItems = [{label:'My Dashboard',href:'/dashboard'},{label:'Transactions', active: true }];
    this.currentpage = 1;
    this._fetchData();
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
  // setupSocketConnection() {
  //   this.socket = io(environment.SOCKET_ENDPOINT, {
  //     auth: {
  //       vendor_id: this.authFackservice.currentUserValue['user_id'],
  //     },query:{
  //       page:this.page.pageNumber,
  //       perPage:this.page.size
  //     }
  //   });
  //   // this.socket.emit('addTransaction', 'Hello there from Angular.');
  //   this.socket.on('getVendorTransaction'+this.authFackservice.currentUserValue['user_id'], (data: any) => {
  //     if(data['status']==true){
  //       this.merchantsData=data['data']
  //     }
  //   });
  // }
  search(){
    this.page.pageNumber=1
    this.currentpage=1;
    this._fetchData()
  }
  public _fetchData() {
    this.authFackservice.statuscount().pipe(first())
          .subscribe(data => {})
    let url='/transactions?page='+this.page.pageNumber+'&perPage='+this.page.size+'&keyword='+this.keyword
    if(this.sortBy!='' && this.order!=''){
      url+='&sortBy='+this.sortBy+'&order='+this.order;
    }   
    if(this.from_date!=undefined ||this.to_date!=undefined || this.from_date<this.to_date)
    {
      url+='&from_date='+this.from_date+'&to_date='+this.to_date
    }    if(this.transfer_type) url+='&transaction_type='+this.transfer_type;

     this.authFackservice.get(url).subscribe(      res => {
        if(res['status']==true){
          this.merchantsData =res['data'];
          this.elementCount=res['elementCount'];
          this.page.totalElements=res['elementCount'];
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
   let parameter='transactions'
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
  clearfilter(){
    this.from_date=undefined;
    this.to_date=undefined;
    this.keyword='';
    this.search()
  }
  datesearch(){
    if(this.from_date==undefined ||this.to_date==undefined || this.from_date>this.to_date)
      {
        return;
      }else{
        this.currentpage=1;
        this.page.pageNumber=1
        this._fetchData();
      }
   }
   openModel(item,largeDataModal: any) {
    this.details=item
 
     this.modalService.open(largeDataModal, { size: 'lg',windowClass:'modal-holder', centered: true });
   }
}
