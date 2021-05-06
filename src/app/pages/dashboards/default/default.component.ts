import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  dashboardData:any={all_transactions_count:0,live_charities_count:0,today_transactions_count:0,
    total_amount_collected:0,total_amount_collected_today:0,live_causes_count:0,total_gross_profit:0,total_gross_profit_today:0};
  earningLineChart:any;
  earningLineChart1:any; 
  series: any;
  constructor(private authFackservice: AuthfakeauthenticationService) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: '' }];
    this._fetchData()
  }
  private _fetchData() {
    this.authFackservice.get('/getStats').subscribe(
      res => {
        if(res['status']==true){
            this.authFackservice.statuscount().pipe(first())
          .subscribe(data => {})
           this.dashboardData =res['data'];
        let collection=res['data']['transactionCollectionLineData'];
        let count=res['data']['transactionsCountLineData'];
        this.earningLineChart= {
            chart: {
                height: 380,
                type: 'line',
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false
                }
            },
            colors: ['#6f62e7', '#34c38f'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: [3, 3],
                curve: 'smooth'
            },
            series: [{
                name: 'Collection Amount',
                data: [parseFloat(collection[0]['transaction_total']),parseFloat(collection[1]['transaction_total']),parseFloat(collection[2]['transaction_total']),parseFloat(collection[3]['transaction_total']),parseFloat(collection[4]['transaction_total']),parseFloat(collection[5]['transaction_total']),parseFloat(collection[6]['transaction_total'])]
            },
            ],
            title: {
                text: 'Collections for last 7 Days',
                align: 'left'
            },
            grid: {
                row: {
                    colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.2
                },
                borderColor: '#f1f1f1'
            }, 
            markers: {
                style: 'inverted',
                size: 6
            },
            xaxis: {
                categories: [collection[0]['DayDate'],collection[1]['DayDate'],collection[2]['DayDate'],collection[3]['DayDate'],collection[4]['DayDate'],collection[5]['DayDate'],collection[6]['DayDate']],
                title: {
                    text: 'Date'
                }
            },
            yaxis: {
                title: {
                     text: 'Collection Amount'
                },
               
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            },
            responsive: [{
                breakpoint: 600,
                options: {
                    chart: {
                        toolbar: {
                            show: false
                        }
                    },
                    legend: {
                        show: false
                    },
                }
            }]
        };
        this.earningLineChart1= {
            chart: {
                height: 380,
                type: 'line',
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false
                }
            },
            colors: [ '#34c38f'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: [3, 3],
                curve: 'smooth'
            },
            series: [{
                name: 'Transaction Count',
                data: [parseFloat(count[0]['transactions_count']),parseFloat(count[1]['transactions_count']),parseFloat(count[2]['transactions_count']),parseFloat(count[3]['transactions_count']),parseFloat(count[4]['transactions_count']),parseFloat(count[5]['transactions_count']),parseFloat(count[6]['transactions_count'])]
            }],
            title: {
                text: 'Transactions for last 7 Days',
                align: 'left'
            },
            grid: {
                row: {
                    colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.2
                },
                borderColor: '#f1f1f1'
            }, 
            markers: {
                style: 'inverted',
                size: 6
            },
            xaxis: {
                categories: [collection[0]['DayDate'],collection[1]['DayDate'],collection[2]['DayDate'],collection[3]['DayDate'],collection[4]['DayDate'],collection[5]['DayDate'],collection[6]['DayDate']],
                title: {
                    text: 'Date'
                }
            },
            yaxis: {
                title: {
                     text: 'Transaction Count'
                },
               
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            },
            responsive: [{
                breakpoint: 600,
                options: {
                    chart: {
                        toolbar: {
                            show: false
                        }
                    },
                    legend: {
                        show: false
                    },
                }
            }]
        };
        };
      });
  }
}
