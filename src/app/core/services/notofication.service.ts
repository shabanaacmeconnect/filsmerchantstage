import { Injectable,EventEmitter } from '@angular/core';
@Injectable({
    providedIn: 'root'
  })

  export class notificationService {
    constructor() {
    }
    notification = new EventEmitter<any>();
  }
