import { Component, HostBinding } from '@angular/core';
import { CardServiceComponent } from "../card-service/card-service.component";
import { serviceCards } from '../../shared/model/plans';
import { ButtonAttentionComponent } from "../button-attention/button-attention.component";

@Component({
  selector: 'app-retain-attention',
  standalone: true,
  imports: [CardServiceComponent, ButtonAttentionComponent],
  templateUrl: './retain-attention.component.html',
  styleUrl: './retain-attention.component.scss'
})
export class RetainAttentionComponent {

  @HostBinding('class') class = 'd-flex flex-column align-items-center justify-content-center'
  serviceCards: any[] = serviceCards

}
