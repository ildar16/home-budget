import { Component, Input } from '@angular/core';

@Component({
  selector: 'qwerty-currency-card',
  templateUrl: './currency-card.component.html',
  styleUrls: ['./currency-card.component.scss']
})
export class CurrencyCardComponent {
  @Input() currency: any;
  currencies: string[] = ['USD', 'EUR'];
}
