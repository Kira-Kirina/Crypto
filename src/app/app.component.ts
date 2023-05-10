import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CurrencyService } from './service/currency.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Crypto Currency Checker';
  selectedCurrency!: FormControl;
  constructor(private currencyService: CurrencyService) {}
  ngOnInit(): void {
    this.selectedCurrency = new FormControl('INR');
    this.selectedCurrency.valueChanges.subscribe((val) =>
      this.changeCurrencyType(val)
    );
  }
  changeCurrencyType(currencyType: string) {
    this.currencyService.changeCurrencyType(currencyType);
  }
}
