import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private currencySubject = new BehaviorSubject('INR');
  currencyObservable$ = this.currencySubject.asObservable();

  constructor() {}

  changeCurrencyType(currencyType: string) {
    this.currencySubject.next(currencyType);
  }
}
