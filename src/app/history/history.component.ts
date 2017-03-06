import {Component, OnInit} from "@angular/core";
import {HistoryService} from "./history.service";
import {HistoryWrapper} from "../model/history-wrapper";

@Component({
  selector: 'history',
  templateUrl: 'history.component.html',
  styleUrls: ['history.component.css']
})

export class HistoryComponent implements OnInit {

  // Wrapper element for chronological overview with trackings AND competitions
  private historyWrapperElements: HistoryWrapper[];

  // select options
  private timeFrame = ['Day', 'Week', 'Month', 'Year'];
  private activeTimeFrame = 'Week';
  private historyTypes = ['Competition', 'Tracking', 'All'];
  private activeHistoryType = 'All';
  private data = ['Average speed', 'Maximum speed', 'Total distance', 'Total duration'];
  private activeData = 'Average speed';

  // Chart parameters
  private lineChartData: Array<any> = [{data: []}];
  private lineChartLabels: Array<any> = [];
  private lineChartColors: Array<any> = [
    {
      backgroundColor: '#2ddeff',
      borderColor: '#2e87fe',
      pointBackgroundColor: '#6388ef',
      pointBorderColor: '#0cd6ef',
      pointHoverBackgroundColor: '#80d234',
      pointHoverBorderColor: '#168b19'
    }
  ];
  private lineChartLegend: boolean = false;
  private lineChartType: string = 'line';
  private lineChartOptions: any = {responsive: true};

  constructor(private historyService: HistoryService) {
  }

  ngOnInit(): void {
    this.historyService.getAllHistoryEvents().subscribe((val) => {
      console.log(val);
      this.historyWrapperElements = val;
      this.setChart(this.activeTimeFrame, this.activeData, this.activeHistoryType);
    }, err => console.log(err));
  }

  setChart(timeframe: string, data: string, historyType: string) {
    let filteredArray: HistoryWrapper[];

    switch (historyType) {
      case 'All':
        filteredArray = this.historyWrapperElements.filter(x => x.type == 'tracking' || x.type == 'competition');
        break;
      case 'Competition':
        filteredArray = this.historyWrapperElements.filter(x => x.type == 'competition');
        break;
      case 'Tracking':
        filteredArray = this.historyWrapperElements.filter(x => x.type == 'tracking');
        break;
    }

    this.setChartData(timeframe, data, filteredArray);
    this.setChartLabels(timeframe);
  }

  private setChartData(timeframe: string, data: string, filteredArray: HistoryWrapper[]) {
    filteredArray = filteredArray.filter(x => {
      if (x.type == 'competition') {
        return this.checkTimeFrame(x.competition.time, timeframe);
      } else {
        return this.checkTimeFrame(x.tracking.time, timeframe);
      }
    });
    let result: number[];
    switch (data) {
      case 'Total duration':
        result = filteredArray.map(x => {
          if (x.type == 'competition') {
            return x.competition.trackings[0].totalDuration;
          } else {
            return x.tracking.totalDuration;
          }
        })
        ;
        break;
      case 'Total distance':
        result = filteredArray.map(x => {
          if (x.type == 'competition') {
            return x.competition.trackings[0].totalDistance;
          } else {
            return x.tracking.totalDistance;
          }
        })
        ;
        break;
      case 'Maximum speed':
        result = filteredArray.map(x => {
          if (x.type == 'competition') {
            return x.competition.trackings[0].maxSpeed;
          } else {
            return x.tracking.maxSpeed;
          }
        })
        ;
        break;
      case 'Average speed':
        result = filteredArray.map(x => {
          if (x.type == 'competition') {
            return x.competition.trackings[0].avgSpeed;
          } else {
            return x.tracking.avgSpeed;
          }
        })
        ;
        break;
    }
    console.log(result);
    this.lineChartData[0] = {data: result}
  }

  private checkTimeFrame(dateToCheck: Date, timeframe: string): boolean {
    let result = false;
    let timeframeBarrier;
    switch (timeframe) {
      case 'Day':
        timeframeBarrier = new Date();
        timeframeBarrier.setHours(0, 0, 0);
        result = dateToCheck >= timeframeBarrier;
        break;
      case 'Week':
        timeframeBarrier = new Date();
        timeframeBarrier = this.getMonday(timeframeBarrier);
        timeframeBarrier.setHours(0, 0, 0);
        result = dateToCheck >= timeframeBarrier;
        break;
      case 'Month':
        timeframeBarrier = new Date();
        timeframeBarrier.setDate(1);
        timeframeBarrier.setHours(0, 0, 0);
        result = dateToCheck >= timeframeBarrier;
        break;
      case 'Year':
        timeframeBarrier = new Date();
        timeframeBarrier.setMonth(0, 1);
        timeframeBarrier.setHours(0, 0, 0);
        result = dateToCheck >= timeframeBarrier;
        break;
    }
    console.log('checktimeframe (' + timeframe + ') : ' + timeframeBarrier.toDateString() + ' ' + timeframeBarrier.toTimeString() + " ==> " + result);
    return result;
  }

  private setChartLabels(timeframe: string) {
    let now = new Date();
    switch (timeframe) {
      case 'Day':
        let hours = [];
        for (let i = 0; i <= 23; i++) {
          hours.push(i);
        }
        this.lineChartLabels = hours;
        break;
      case 'Week':
        this.lineChartLabels = ['Mo', 'Tu', 'We', 'Thu', 'Fri', 'Sat', 'Sun'];
        break;
      case 'Month':
        let N = this.daysInMonth(now.getMonth(), now.getFullYear());
        let days = [];
        console.log(N);
        for (let i = 1; i <= N; i++) {
          days.push(i);
        }
        this.lineChartLabels = days;
        break;
      case 'Year':
        this.lineChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        break;
    }
  }

  private daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  private getMonday(d): Date {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

  // chart events
  chartClicked(e: any): void {
    console.log(e);
  }

  chartHovered(e: any): void {
    console.log(e);
  }

  // Select options
  onDataChange(e) {
    this.activeData = e;
    this.setChart(this.activeTimeFrame, this.activeData, this.activeHistoryType);
  }

  onHistoryTypesChange(e) {
    this.activeHistoryType = e;
    this.setChart(this.activeTimeFrame, this.activeData, this.activeHistoryType);
  }

  onTimeFrameChange(e) {
    this.activeTimeFrame = e;
    this.setChart(this.activeTimeFrame, this.activeData, this.activeHistoryType);
  }
}
