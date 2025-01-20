import { Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'app-card-service',
  standalone: true,
  imports: [],
  templateUrl: './card-service.component.html',
  styleUrl: './card-service.component.scss'
})
export class CardServiceComponent {

  @HostBinding('class') class = 'd-flex bg-color-primary-dark rounded-4 p-4 p-sm-5'
  image = input.required<string>()
  text = input.required<string>()

}
