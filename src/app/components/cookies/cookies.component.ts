import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DialogModule } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cookies',
  imports: [DialogModule],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.scss'
})
export class CookiesComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) {}

  @ViewChild('modalCookies') modalCookies: TemplateRef<any>
  showModalCookies: boolean = true

  ngOnInit(): void {
    this.checkCookiesShow();
  }

  checkCookiesShow() {
    if (localStorage.getItem("cookiePreferences") === "accepted") {
      return;
    }
    setTimeout(() => {
      this.openModalCookies();
    }, 2000);
  }


  openModalCookies() {
    const dialogRef = this.dialog.open(this.modalCookies, {
      position: { bottom: '30px' },
      disableClose: true
    })
    dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        const button = document.getElementById('save-preferences');
        button?.focus();
      }, 0);
    });
  }

  refuseCookies() {
    this.clearAllCookies();
    localStorage.removeItem("cookiePreferences");
    sessionStorage.clear();
    this.dialog.closeAll();
    this.showModalCookies = true
  }

  clearAllCookies() {
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  }

  acceptCookies() {
    localStorage.setItem("cookiePreferences", "accepted");
    this.showModalCookies = false
    this.dialog.closeAll()
  }

}
