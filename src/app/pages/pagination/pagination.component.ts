import { Component, OnInit,OnChanges,Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnInit,OnChanges {
    @Input() page; // decorate the property with @Input()
    @Output() newItemEvent = new EventEmitter<any>();
    pagelist=[];
    noOfPage: number;
  constructor() { }

  ngOnInit() {
      this.setPagination();
  }
  setPagination(){
    this.pagelist=[];
    this.noOfPage=(this.page.totalElements/this.page.size)
    this.noOfPage=Math.trunc(this.noOfPage)
    let additional=(this.page.totalElements%this.page.size)
    if(additional>0||this.noOfPage==0){
      this.noOfPage=this.noOfPage+1;
    }
    this.pagination()
    for(let i=0;i<this.noOfPage;i++){
     // this.pagelist.push(i+1);
    }
  }
   pagination() {
    var current = this.page.pageNumber,
        last = this.noOfPage,
        delta = 2,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l;

    for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
            range.push(i);
        }
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    this.pagelist= rangeWithDots;
}

  getNext(){
      if(this.page.pageNumber!=this.noOfPage){
        this.page.pageNumber+=1;
        this.newItemEvent.emit(this.page.pageNumber);
        this.setPagination()
      }
     
  }
  getLast(){
    if(this.page.pageNumber!=this.noOfPage){
    this.page.pageNumber=this.noOfPage;
    this.newItemEvent.emit(this.page.pageNumber);
    this.setPagination()
    }
    }
    getPrev(){
        if(this.page.pageNumber!=1){
            this.page.pageNumber-=1;
            this.newItemEvent.emit(this.page.pageNumber);
            this.setPagination();
        }
       
    }
    getFirst(){
        if(this.page.pageNumber!=1){
        this.page.pageNumber=1;
        this.newItemEvent.emit(this.page.pageNumber);
        this.setPagination();
        }
    }
    setPage(item){
        if(item=='...')
        return;
        this.page.pageNumber=item;
        this.newItemEvent.emit(this.page.pageNumber);
        this.setPagination()
    }
    ngOnChanges(changes) {
        this.setPagination();
      }
}