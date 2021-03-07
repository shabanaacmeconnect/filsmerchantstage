import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { environment } from '../../../../environments/environment';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
})

/**
 * Login component
 */
export class CancelComponent implements OnInit {

  year: number = new Date().getFullYear();
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
    private authFackservice: AuthfakeauthenticationService) {

     }

  ngOnInit() {
      
  }
}
