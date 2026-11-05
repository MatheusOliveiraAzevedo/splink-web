import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-black-friday-rules',
  standalone: true,
  imports: [],
  templateUrl: './black-friday-rules.component.html',
  styleUrl: './black-friday-rules.component.scss'
})
export class BlackFridayRulesComponent {
  @HostBinding('class') class = 'd-flex flex-column align-items-center py-6 px-5';
}
