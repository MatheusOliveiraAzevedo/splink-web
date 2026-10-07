import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.scss'
})
export class CookiesComponent implements OnInit, OnDestroy {

  @ViewChild('modalCookies') modalCookies: ElementRef<HTMLDialogElement>;
  private openTimer?: ReturnType<typeof setTimeout>;

  ngOnDestroy(): void {
    clearTimeout(this.openTimer);
    this.modalCookies?.nativeElement.close();
  }

  ngOnInit(): void {
    this.checkCookiesShow();
  }

  checkCookiesShow() {
    if (localStorage.getItem("cookiePreferences") === "accepted") {
      return;
    }
    this.openTimer = setTimeout(() => {
      this.openModalCookies();
    }, 2000);
  }


  openModalCookies() {
    this.modalCookies.nativeElement.showModal();
    this.modalCookies.nativeElement.querySelector<HTMLButtonElement>('#save-preferences')?.focus({ preventScroll: true });
  }

  onDialogKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;
    const elements = this.modalCookies.nativeElement.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  refuseCookies() {
    this.clearAllCookies();
    localStorage.removeItem("cookiePreferences");
    sessionStorage.clear();
    this.modalCookies.nativeElement.close();
  }

  clearAllCookies() {
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  }

  acceptCookies() {
    localStorage.setItem("cookiePreferences", "accepted");
    this.modalCookies.nativeElement.close()
  }

}
