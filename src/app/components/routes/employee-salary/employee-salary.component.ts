import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-salary',
  templateUrl: './employee-salary.component.html',
  styleUrls: ['./employee-salary.component.css']
})
export class EmployeeSalaryComponent {
  workDays: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  startTimes: string[] = ['', '', '', '', ''];
  endTimes: string[] = ['', '', '', '', ''];
  breakMinutes: number = 0;
  hourlyRate: number = 0;
  totalHours: number | null = null;
  totalPay: number | null = null;

  calculateSalary() {
    let totalMinutes = 0;

    for (let i = 0; i < this.workDays.length; i++) {
      if (this.startTimes[i] && this.endTimes[i]) {
        const start = this.parseTime(this.startTimes[i]);
        const end = this.parseTime(this.endTimes[i]);
        const minutesWorked = (end - start) - this.breakMinutes;
        totalMinutes += minutesWorked;
      }
    }

    this.totalHours = totalMinutes / 60;
    this.totalPay = this.totalHours * this.hourlyRate;
  }

  parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
