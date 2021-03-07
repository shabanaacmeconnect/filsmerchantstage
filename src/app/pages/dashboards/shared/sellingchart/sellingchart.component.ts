import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sellingchart',
  templateUrl: './sellingchart.component.html',
  styleUrls: ['./sellingchart.component.scss']
})
export class SellingchartComponent implements OnInit {

  // @Input() Chartcolor;
  @Input() value;

  chartData: any;

  constructor() { }
  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  ngOnInit(): void {
    this.chartData = {
      series: [this.value],
      chart: {
        type: 'radialBar',
        width: 60,
        height: 60,
        sparkline: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: [this.getRandomColor()],
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '60%'
          },
          track: {
            margin: 0
          },
          dataLabels: {
            show: false
          }
        }
      }
    };
  }
}
