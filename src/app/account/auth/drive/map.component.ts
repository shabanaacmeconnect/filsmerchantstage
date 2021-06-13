import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren,NgZone, AfterViewInit, ContentChild, TemplateRef, EventEmitter, Output, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-map',
  templateUrl:'./map.component.html',
})

/**
 * Ecomerce merchants component
 */
export class MapComponent implements OnInit {
  loginForm1: FormGroup;

  @Input() public data;
 
  constructor( public activeModal: NgbActiveModal,private modalService: NgbModal,public formBuilder: FormBuilder) {
      
     }

  ngOnInit() {
   
  
  }

   

}
