import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-causes',
  templateUrl: './causes.component.html',
})
export class CausesComponent implements OnInit {
  page={totalElements:0,pageNumber:1,size:10};
  elementCount=0;
  currentpage=1;
  breadCrumbItems: Array<{}>;
  merchantsData:any=[];
  term: any;
  hrefLink: any;
  blob: Blob;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>=Object.create(null);

  title='Add';
  keyword: string='';
  id:any;
  sortBy='';
  order='';
  cause: any;
  constructor( private route: ActivatedRoute,private router: Router,private modalService: NgbModal,public notificationService:notificationService,
    private authFackservice: AuthfakeauthenticationService,public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id")?this.route.snapshot.paramMap.get("id"):0;

    this.breadCrumbItems = [{label:'My Dashboard',href:'/dashboard'},{ label: 'Charity', href:'/charity/list'},{label:'Approved Causes', active: true }];
    this.currentpage = 1;
    this._fetchData();
  }

  search(){
    this.page.pageNumber=1
    this.currentpage=1;
    this._fetchData()
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
  public _fetchData() {
    let url='/charityCauses?page='+this.page.pageNumber+'&perPage='+this.page.size+'&keyword='+this.keyword
    if(this.sortBy!='' && this.order!=''){
      url+='&sortBy='+this.sortBy+'&order='+this.order;
    } 
    if(this.id){
      url+='&charity_id='+this.id
    }
    this.authFackservice.get(url).subscribe(
      res => {
        if(res['status']==true){
          this.merchantsData =res['data'];
          this.elementCount=res['elementCount'];
          this.page.totalElements=res['elementCount'];
          this.authFackservice.statuscount().pipe(first())
          .subscribe(data => {})
          
        }
      });
      this.authFackservice.get('/assignedCharityCause').subscribe(
        res => {
          if(res['status']==true){
            if(res['data']!=[]){
               this.cause=res['data'][0].assigned_cause_id;
            }
          }
        });
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
      this.authFackservice.put('/causes/status?value='+currentTarget+'&user_id='+id,{}).subscribe(
        res => {
          if(res['status']==true){
            if(currentTarget==0)
            Swal.fire('Enabled!', 'Selected cause has been enaled.', 'success');
            else
            Swal.fire('Disabled!', 'Selected cause has been disabled.', 'success');
            this._fetchData();
          }
        });  
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
        this.authFackservice.delete('/causes?user_id='+item.user_id).subscribe(
          res => {
            if(res['status']==true){
              Swal.fire('Deleted!', 'Selected cause has been deleted.', 'success');
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
 export(type){
  let parameter='charityCauses'
  let url='/exportData?parameter='+parameter+'&type='+type;
  if(this.id)
  url+='&charity_id='+this.id;
  this.authFackservice.getFile(url).subscribe((res:any)=>{
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
  assign(data) {
    
    var formData: any = new FormData();
    formData.append("charity_id", this.id);
    formData.append("cause_id", data.id);
    
    // if(this.charity!='' && this.cause!='' && this.cause!=this.typeValidationForm.value.cause_id){
    //   let a=this.charities.filter(x=>{return x.user_id== this.typeValidationForm.value.charity_id})
    //   let b=this.causes.filter(x=>{return x.id== this.typeValidationForm.value.cause_id})
      Swal.fire({
        title: 'Are you sure?',
        text: 'Would you like to change the cause to '+data.cause_name,
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
                this._fetchData();
                Swal.fire('Success!', 'Selected cause has been configured.', 'success');
    
              }else{
                Swal.fire('Error!', res['message'], 'error');
              }
              // this.modalService.dismissAll()
            }); 
        }
      })
    // }else if( this.cause!=this.typeValidationForm.value.cause_id){
    //   this.authFackservice.putMultipart('/assignCharityCause',formData).subscribe(
    //       res => {
    //         if(res['status']==true){
    //           this.assign();
    //           Swal.fire('Success!', 'Selected cause has been configured.', 'success');
    //         }else{
    //           Swal.fire('Error!', res['message'], 'error');
    //         }
    //         this.modalService.dismissAll()
    //   }); 
    // }else               this.modalService.dismissAll()

  }
}
