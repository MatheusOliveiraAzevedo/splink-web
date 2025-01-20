import { Component, HostBinding } from '@angular/core';
import { CardServiceComponent } from "../card-service/card-service.component";

@Component({
  selector: 'app-retain-attention',
  standalone: true,
  imports: [CardServiceComponent],
  templateUrl: './retain-attention.component.html',
  styleUrl: './retain-attention.component.scss'
})
export class RetainAttentionComponent {

  @HostBinding('class') class = ''

  

}
