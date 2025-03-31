import { CommonModule } from '@angular/common';
import { Component, HostBinding, TemplateRef, ViewChild, viewChild } from '@angular/core';

@Component({
  selector: 'app-coverage-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coverage-area.component.html',
  styleUrl: './coverage-area.component.scss'
})
export class CoverageAreaComponent {

  @HostBinding('class') class = 'd-flex justify-content-center'
  showMap: boolean = false

}
