import { Component, OnInit } from '@angular/core';
import { Employee } from './_models/employee';
import { EmployeeViewPage } from './_models/employeeViewPage';
import { EmployeeService } from './_services/employee.service';
import { Chart } from 'chart.js/auto'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  employees: Employee[] = [];
  employeesViewPage: EmployeeViewPage[] = [];
  chart: any;
  randomColorArray: string[] = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

  constructor(private employeeService: EmployeeService){}
  
  async ngOnInit(): Promise<void> {
    await this.LoadEmployeeTable()
    this.LoadPieChart()
  }
  
  async LoadEmployeeTable(): Promise<void>{
    await this.LoadEmployees();

    let sumTotalTimeWorked: number;
    let employee: Employee;
    let employeeWithSameName: Employee;
    let endTimeUtc: Date;                     
    let starTimeUtc: Date;                    

    for(let i = 0; i < this.employees.length; i++){
      employee = this.employees[i];
      sumTotalTimeWorked = 0;

      for(let j = 0; j < this.employees.length; j++){
        if(employee.EmployeeName === this.employees[j].EmployeeName){
          employeeWithSameName = this.employees[j];
          endTimeUtc = new Date(employeeWithSameName.EndTimeUtc)      //  bez istanciranja dobio bih error u konzoli:
          starTimeUtc = new Date(employeeWithSameName.StarTimeUtc)    // ERROR Error: Uncaught (in promise): TypeError: employeeWithSameName.EndTimeUtc.getTime is not a function 
          sumTotalTimeWorked += Math.abs(endTimeUtc.getTime() - starTimeUtc.getTime()) / 36e5;
          this.employees.splice(j, 1);
          j--;
        }
      }

      this.employeesViewPage.push({
        EmployeeName: employee.EmployeeName ? employee.EmployeeName : "Unknown",
        TotalTimeWorked: Math.round(sumTotalTimeWorked)
      });
    }
    this.employeesViewPage.sort((a, b) => b.TotalTimeWorked - a.TotalTimeWorked);
  }

  ReturnRandomColors(numberOfColorsInArray: number): string[]{
    const result: string[] = [];
    while (result.length < numberOfColorsInArray) {
      const randomIndex = Math.floor(Math.random() * numberOfColorsInArray);
      const randomString = this.randomColorArray[randomIndex];
      if (!result.includes(randomString)) {
        result.push(randomString);
      }
    }
    return result;
  }

  LoadPieChart(){
    const labels: string[] = this.employeesViewPage.map((employee)=> employee.EmployeeName);
    const data: number[] = this.employeesViewPage.map((employee) => employee.TotalTimeWorked);
    const colors: string[] = this.ReturnRandomColors(this.employeesViewPage.length); 

    this.chart = new Chart("Chart", {
      type: 'pie', 
      data: {
        labels: labels,
	      datasets: [{
            label: 'Total Time Worked',
            data: data,
            backgroundColor: colors,
            hoverOffset: 4
          }],
      },
      options: {
        aspectRatio:2.5
      }
    });
  }

  async LoadEmployees(): Promise<void>{
    return new Promise<void>((resolve,rejcet)=>this.employeeService.getEmployees().subscribe({
      next: employess => {
        this.employees = employess
        resolve();
      },
      error: error => rejcet(error)
    })) 
  }
}