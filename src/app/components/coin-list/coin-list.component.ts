import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { Observable, map, switchMap, tap } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CurrencyService } from 'src/app/service/currency.service';

@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss'],
})
export class CoinListComponent implements OnInit {
  title = 'Crypto Currency Checker';
  currencyData!: any;
  currencyData$!: Observable<any>;

  displayedColumns: string[] = [
    'symbol',
    'current_price',
    'price_change_percentage_24h',
    'market_cap',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  currencyType: string = 'INR';

  constructor(
    private apiService: ApiService,
    private currencyService: CurrencyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currencyService.currencyObservable$.subscribe((data) => {
      this.currencyType = data;
      this.getAllCurrency();
      this.getTrendingCurrency();
    });
    this.getAllCurrency();
    this.getTrendingCurrency();
  }

  getAllCurrency() {
    this.apiService.getCurrency(this.currencyType).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      return data;
    });
  }
  getTrendingCurrency() {
    this.apiService
      .getTrendingCurrency(this.currencyType)
      .subscribe((data) => (this.currencyData = data));
  }

  gotoDetails(id: string) {
    this.router.navigate(['coin-detail', id]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
