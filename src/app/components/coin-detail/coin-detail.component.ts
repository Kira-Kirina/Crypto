import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { CurrencyService } from 'src/app/service/currency.service';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss'],
})
export class CoinDetailComponent implements OnInit {
  coinData: any;
  coinId!: string;
  days: number = 1;
  currency!: string;

  @ViewChild(BaseChartDirective) coinChart!: BaseChartDirective;
  lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: `Price Trends`,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: '#009688',
        pointBackgroundColor: '#009688',
        pointBorderColor: '#009688',
        pointHoverBackgroundColor: '#009688',
        pointHoverBorderColor: '#009688',
      },
    ],
    labels: [],
  };
  lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1,
      },
    },

    plugins: {
      legend: { display: true },
    },
  };
  lineChartType: ChartType = 'line';

  constructor(
    private apiService: ApiService,
    private currencyService: CurrencyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (paramMap) => (this.coinId = paramMap.get('id')!)
    );

    this.currencyService.currencyObservable$.subscribe((data) => {
      this.currency = data;
      this.getCoin();
      this.getGraph(this.days);
    });
    this.getCoin();
    this.getGraph(this.days);
  }

  getCoin() {
    this.apiService.getCurrencyById(this.coinId).subscribe((data) => {
      this.coinData = data;
      console.log(data);
    });
  }
  getGraph(days: number) {
    this.days = days;
    this.apiService
      .getGrpahicalCurrencyData(this.coinId, this.currency, this.days)
      .subscribe((data: any) => {
        setTimeout(() => {
          this.coinChart.chart?.update();
        }, 200);
        console.log(data);
        this.lineChartData.datasets[0].data = data.prices.map(
          (item: any) => item[1]
        );
        this.lineChartData.labels = data.prices.map((item: any) => {
          let date = new Date(item[0]);
          let time =
            date.getHours() > 12
              ? `${date.getHours() - 12} : ${date.getMinutes()} PM`
              : `${date.getHours()} : ${date.getMinutes()} AM`;
          return this.days === 1 ? time : date.toLocaleTimeString();
        });
      });
  }
}
