import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { EventService } from 'src/app/core/services/event.service';

@Component({
  selector: 'app-vertical',
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.scss']
})

/**
 * Vertical component
 */
export class VerticalComponent implements OnInit, AfterViewInit {
  currentUser: any;
  userlogo=localStorage.getItem('user_logo')
  merchantsData={balance:0}
  isCondensed = false;

  constructor(private eventService: EventService,private router: Router,  private authFackservice: AuthfakeauthenticationService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        document.body.classList.remove('sidebar-enable');
      }
    });
    this.authFackservice.statuscount() .pipe(first())
    .subscribe(data => {})
    this.merchantsData= this.authFackservice.currentstatusvalue;

  }

  ngOnInit() {
    this.eventService.subscribe('currentstatus', (layout) => {
      this.merchantsData=layout
    })
    document.body.removeAttribute('data-layout');
    document.body.removeAttribute('data-topbar');
    document.body.removeAttribute('data-layout-size');
    document.body.classList.remove('sidebar-enable');
    document.body.classList.remove('vertical-collpsed');
    document.body.removeAttribute('data-sidebar-size');
    this.currentUser = this.authFackservice.currentUserValue;

  }
  logout() {
    this.authFackservice.logout();
  this.router.navigate(['/account/login']);
}
  isMobile() {
    const ua = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua);
  }

  ngAfterViewInit() {
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    this.isCondensed = !this.isCondensed;
    document.body.classList.toggle('sidebar-enable');
    document.body.classList.toggle('vertical-collpsed');

    if (window.screen.width <= 768) {
      document.body.classList.remove('vertical-collpsed');
    }
  }
}
