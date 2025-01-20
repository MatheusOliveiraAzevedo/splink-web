import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-coverage-area',
  standalone: true,
  imports: [],
  templateUrl: './coverage-area.component.html',
  styleUrl: './coverage-area.component.scss'
})
export class CoverageAreaComponent {

  @HostBinding('class') class = 'd-flex'

}
