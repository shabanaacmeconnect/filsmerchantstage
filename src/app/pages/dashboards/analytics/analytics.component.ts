import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  dashboardData:any={all_transactions_count:0,charities_count:0,today_transactions_count:0,
    total_amount_collected:0,total_amount_collected_today:0};
    salesAnalyticsDonutChart:any;
    barChart:any;
causeTypeCollection=[];
channelCollection=[];
merchantCategoryCollection=[]
  series: any;
  constructor(private authFackservice: AuthfakeauthenticationService) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: '' }];
    this._fetchData()
  }
  private _fetchData() {

    this.authFackservice.get('/getAnalytics').subscribe(
      res => {
        if(res['status']==true){
        
           this.dashboardData =res['data'];
           this.dashboardData['causeTypeCollection']['labels'].forEach((element,i) => {
            this.causeTypeCollection.push({label:element,series:this.dashboardData['causeTypeCollection']['series'][i]})
           });
           this.dashboardData['channelCollection']['labels'].forEach((element,i) => {
            this.channelCollection.push({label:element,series:this.dashboardData['channelCollection']['series'][i]})
           });
          //  this.dashboardData['merchantCategoryCollection']['labels'].forEach((element,i) => {
          //   this.merchantCategoryCollection.push({label:element,series:this.dashboardData['merchantCategoryCollection']['series'][i]})
          //  });
           let monthlydata= {month:[],value:[]};
           for (const [key, element] of Object.entries(this.dashboardData['monthlyBarData'])) {
            monthlydata.month.push(key)
            monthlydata.value.push(element);
            
           };
           this.barChart= {
            chart: {
                height: 380,
                type: 'bar',
            },
          
            plotOptions: {
              bar: {
                  vertical: true,
              }
          },
          dataLabels: {
              enabled: false
          },
          series: [{
              data:monthlydata.value,
              title: {
                text: 'Amount'
           },
          }],
          colors: ['#6f62e7'],
          xaxis: {
            title: {
              text: 'Months'
          },
          categories: monthlydata.month,
          },
          grid: {
              borderColor: '#f1f1f1'
          },
            // title: {
            //     text: 'Collections for last 7 Days',
            //     align: 'left'
            // },
          
        };
        this.salesAnalyticsDonutChart ={
            series: [56, 38, 26],
            chart: {
                type: 'donut',
                height: 240,
            },
            title: {
                        text: 'Collections for last 7 Days',
                        align: 'left'
                    },
            labels: ['Series A', 'Series B', 'Series C'],
            colors: ['#556ee6', '#34c38f', '#f46a6a'],
            legend: {
                show: false,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '70%',
                    }
                }
            }
        };
      
        };
      });
      this.authFackservice.statuscount().pipe(first())
      .subscribe(data => {})
  }
  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
