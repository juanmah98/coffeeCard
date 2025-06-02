import { ChangeDetectorRef, Component } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Empleados } from 'src/app/interfaces/empleados';
import { Horarios } from 'src/app/interfaces/horarios';
import { SupabaseService } from 'src/app/services/supabase.service';

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

schedules: Horarios[] = [];
  employees: Empleados[] = [];
  allEmployees: Empleados[] = [];
  selectedDate: any | null = null;
  selectedDateCalendar: any | null = null;
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  // Nuevo calendario mensual
newCalendarMonth: number = new Date().getMonth();
newCalendarYear: number = new Date().getFullYear();
  currentMonthName: string = '';
  daysInMonth: any[] = [];
  weekDays: string[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  defaultEntry: string = '00:00';
defaultExit: string = '00:00';
currentWeekStart: Date = this.getStartOfWeek(new Date());
newEmployeeName: string = '';
newEmployeeRate: number = 0;
monthlySummary: any[] = [];



  // Propiedades adicionales en la clase
  months: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];


  constructor(private _supabaseServices: SupabaseService, private cdr: ChangeDetectorRef) {
   
  }

  // Agregar esta propiedad en la clase
// Formatear fecha como "dd/mm"
formatDateES(date: Date): string {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}

// Método para generar el resumen mensual
generateMonthlySummary() {
  this.monthlySummary = [];
  const weeksInMonth = this.getWeeksInMonth(this.currentYear, this.currentMonth);

  weeksInMonth.forEach(week => {
    const weekSummary: any = {
      startDate: this.formatDateES(week.start),
      endDate: this.formatDateES(week.end),
      days: []
    };

    for (let i = 0; i < 5; i++) { // Lunes a Viernes
      const currentDate = new Date(week.start);
      currentDate.setDate(week.start.getDate() + i);

      // Ajustar a zona horaria de España
      const adjustedDate = this.adjustToSpainTimezone(currentDate);
      const formattedDate = adjustedDate.toISOString().split('T')[0];

      const daySummary: any = {
        date: formattedDate,
        schedules: {}
      };

      // Iterar sobre TODOS los empleados (activos e inactivos)
      this.allEmployees.forEach(employee => {
        const schedule = this.getScheduleForDay(employee.id, formattedDate);
        daySummary.schedules[employee.id] = {
          entry: schedule.entry,
          exit: schedule.exit
        };
      });

      weekSummary.days.push(daySummary);
    }

    this.monthlySummary.push(weekSummary);
  });
}

// Método para obtener las semanas del mes
getWeeksInMonth(year: number, month: number) {
  const weeks = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Ajustar el primer día al Lunes de la semana
  let startOfWeek = this.getStartOfWeek(firstDay);

  while (startOfWeek <= lastDay) {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4); // Lunes + 4 días = Viernes

    weeks.push({
      start: new Date(startOfWeek),
      end: new Date(endOfWeek),
    });

    // Mover al siguiente Lunes
    startOfWeek.setDate(startOfWeek.getDate() + 7);
  }

  return weeks;
}


// Método para formatear la fecha
formatDate(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

// Llamar a generateMonthlySummary en el ngOnInit
async ngOnInit(): Promise<void> {
  await this.loadCurrentMonth();
  await this.fetchData();
  await this.generateDaysInMonth();
  this.generateMonthlySummary();
  this.cdr.detectChanges();
}
  async generateDaysInMonth() {
    const today = new Date();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const lastDay = new Date(this.currentYear, this.currentMonth, daysInMonth).getDay();
  
    this.daysInMonth = [];
  
    // Añadir días vacíos al principio
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      this.daysInMonth.push({ dayNumber: null, date: null, isToday: false });
    }
  
    // Añadir días reales del mes
    for (let day = 1; day <= daysInMonth; day++) {
      // Usamos Date.UTC para evitar desfases por zona horaria
      const date = new Date(Date.UTC(this.currentYear, this.currentMonth, day));
      const isoDateString = date.toISOString().split('T')[0]; // Formato ISO (YYYY-MM-DD)
  
      this.daysInMonth.push({
        dayNumber: day,
        date: isoDateString, // Almacena la fecha en formato ISO
        isToday:
          today.getUTCFullYear() === date.getUTCFullYear() &&
          today.getUTCMonth() === date.getUTCMonth() &&
          today.getUTCDate() === date.getUTCDate(),
      });
    }
  
    // Añadir días vacíos al final
    for (let i = lastDay; i < 6; i++) {
      this.daysInMonth.push({ dayNumber: null, date: null, isToday: false });
    }
  }
  
  
  
  

  calculateWeeklyHours(employeeId: string): number {
    let totalMinutes = 0;
  
    for (const day of this.workDays) {
      const entryTime = this.getWeeklySchedule(employeeId, day, 'entry');
      const exitTime = this.getWeeklySchedule(employeeId, day, 'exit');
  
      if (entryTime && exitTime) {
        const start = this.parseTime(entryTime);
        const end = this.parseTime(exitTime);
  
        if (end > start) {
          totalMinutes += end - start;
        }
      }
    }
  
    return totalMinutes / 60; // Devuelve las horas totales trabajadas
  }
  
  parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
  

  async fetchData() {
    try {
      this.employees = await this._supabaseServices.getEmployees();
      this.allEmployees = await this._supabaseServices.getEmployees();
      this.schedules = await this._supabaseServices.getSchedules();
      
     /*  console.log('Empleados (activos e inactivos):', this.allEmployees);
      console.log('Horarios (todos):', this.schedules); */ // Verifica que incluya a Diana
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
    this.cdr.detectChanges();
  }

  loadCurrentMonth() {
    this.currentMonthName = new Date(this.currentYear, this.currentMonth).toLocaleString('es-ES', { month: 'long' });
    this.generateDaysInMonth();
  }
  
// Método para ajustar a CET/CEST (España)
adjustToSpainTimezone(date: Date): Date {
  const offset = date.getTimezoneOffset();
  const spainOffset = -120; // UTC+1 (CET) o UTC+2 (CEST)
  return new Date(date.getTime() + (offset - spainOffset) * 60 * 1000);
}
  

  getScheduleForDay(employeeId: string, date: string): { entry: string; exit: string } {
    const schedule = this.schedules.find((s) => {
      const storedDate = new Date(s.date).toISOString().split('T')[0]; // Convertir a ISO
     /*  console.log('Comparando:', { storedDate, selectedDate: date }); */
  
      return s.empleado_id === employeeId && storedDate === date;
    });
  
   /*  console.log('Horario encontrado:', schedule); */
  
    return {
      entry: schedule?.entry || this.defaultEntry,
      exit: schedule?.exit || this.defaultExit,
    };
  }
  
  
  
  
  
  
  
  

  async saveSchedule(employeeId: string, date: string, entry: string, exit: string) {
    const formattedDate = date; // Ya está en formato ISO desde la selección
  
    try {
      const response = await this._supabaseServices.saveSchedule({
        empleado_id: employeeId,
        date: formattedDate,
        entry,
        exit,
      });
  
      if (response.error) {
        console.error('Error al guardar en Supabase:', response.error);
      } else {
        console.log('Horario sincronizado con Supabase:', response.data);
      }
  
      // Recargar datos
      await this.fetchData();
    } catch (error) {
      console.error('Error inesperado en saveSchedule:', error);
    }
  }
  
  
  
  
  
  
  

  selectDate(date: string) {
    this.selectedDate = date; // La fecha ya está en formato ISO
    this.selectedDateCalendar = date; // Usar directamente el mismo formato
   /*  console.log('Fecha seleccionada (ISO):', this.selectedDate); */
    this.cdr.detectChanges();
  }
  
  
  
  
  horas(fecha:any){
    const str0 = fecha;
    const validFormats = [
      {
        format: 'm/d/yyyy',
        delimiter: '/',
        order: 'mdy'
      },
      {
        format: 'd/m/yyyy',
        delimiter: '/',
        order: 'dmy'
      },
      {
        format: 'yyyy-m-d',
        delimiter: '-',
        order: 'ymd'
      }
    ];
    
    const toDate = (dateString: any, format = 'm/d/yyyy') => {
      const validFormat = validFormats.find(d => d.format === format)
      if (!validFormat) throw "Unexpected date format";
    
      const order     = validFormat.order;
      const dateParts = dateString.split(validFormat.delimiter);
      const year      = dateParts[order.indexOf('y')];
      const month     = dateParts[order.indexOf('m')];
      const day       = dateParts[order.indexOf('d')];
      return new Date(year,month-1,day).toLocaleDateString('es-ES');
    };
  /*    
    const str1 = '1/14/2020';
    const str2 = '14/1/2020';
    const str3 = '2020-1-14';
    
    console.log( toDate(str1));
    console.log( toDate(str2,'d/m/yyyy') );
    console.log( toDate(str3,'yyyy-m-d') );
    console.log( toDate(str0) ); */

    return toDate(str0);
  }
  
  
  
  
  
  navigateMonth(offset: number) {
    this.currentMonth += offset;
  
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
   this.loadCurrentMonth()
    this.generateDaysInMonth();
  }

  navigateNewCalendarMonth(step: number) {
  this.newCalendarMonth += step;
  if (this.newCalendarMonth < 0) {
    this.newCalendarMonth = 11;
    this.newCalendarYear--;
  } else if (this.newCalendarMonth > 11) {
    this.newCalendarMonth = 0;
    this.newCalendarYear++;
  }
}
  

  async handleTimeChange(event: Event, employeeId: string, date: string, type: 'entry' | 'exit') {
    try {
      const inputElement = event.target as HTMLInputElement;
      const value = inputElement.value;
  
      // Obtener el horario actual del día
      const schedule = this.getScheduleForDay(employeeId, date);
  
      // Actualizar el horario correspondiente (entry o exit)
      if (type === 'entry') {
        await this.saveSchedule(employeeId, date, value, schedule.exit);
      } else {
        await this.saveSchedule(employeeId, date, schedule.entry, value);
      }
  
     /*  console.log(`Horario actualizado: ${type} para ${employeeId} en ${date}`); */
    } catch (error) {
      console.error("Error al manejar el cambio de horario:", error);
    }
  }
  
  
  
  
  getWeeklySchedule(employeeId: string, day: string, type: 'entry' | 'exit'): string {
    const selectedDate = new Date(this.currentWeekStart);
    const dayIndex = this.workDays.indexOf(day); // Indice del día (0 para Lunes)
  
    selectedDate.setDate(this.currentWeekStart.getDate() + dayIndex); // Ajusta la fecha al día correcto
  
    const schedule = this.schedules.find(
      (s) => s.empleado_id === employeeId && 
             new Date(s.date).toDateString() === selectedDate.toDateString()
    );
  
    return type === 'entry' ? schedule?.entry || this.defaultEntry : schedule?.exit || this.defaultExit;
  }
  

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  }
  

  async updateWeeklySchedule(event: Event, employeeId: string, day: string, type: 'entry' | 'exit') {
    try {
      // Obtener el valor del input
      const inputElement = event.target as HTMLInputElement;
      const value = inputElement.value;
  
      // Calcular la fecha seleccionada según el día de la semana
      const selectedDate = new Date(this.currentWeekStart); // Fecha del inicio de la semana
      const dayIndex = this.workDays.indexOf(day); // Índice del día
      selectedDate.setDate(this.currentWeekStart.getDate() + dayIndex);
  
      // Convertir la fecha a formato ISO (YYYY-MM-DD)
      const formattedDate = selectedDate.toISOString().split('T')[0];
  
     /*  console.log("Fecha seleccionada (ISO):", formattedDate);
      console.log("Día seleccionado:", day);
      console.log("Tipo de horario:", type); */
  
      // Obtener el horario actual del día
      const schedule = this.getScheduleForDay(employeeId, formattedDate);
  
      // Actualizar el horario correspondiente (entry o exit)
      if (type === 'entry') {
        await this.saveSchedule(employeeId, formattedDate, value, schedule.exit);
      } else {
        await this.saveSchedule(employeeId, formattedDate, schedule.entry, value);
      }
  
     /*  console.log("Horario actualizado correctamente para:", { employeeId, day, type, value }); */
    } catch (error) {
      console.error("Error al actualizar el horario semanal:", error);
    }
  }
  
  

  getStartOfWeek(date: Date): Date {
    const day = date.getDay(); // Obtiene el día de la semana (0 = Domingo)
    const diff = (day === 0 ? -6 : 1) - day; // Calcula la diferencia para llegar al lunes
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() + diff);
    return startOfWeek;
  }
  
  navigateWeek(offset: number): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + offset * 7);
    this.currentWeekStart = this.getStartOfWeek(this.currentWeekStart);
    this.cdr.detectChanges(); // Forzar detección de cambios en la vista
  }
  
  getWeekTitle(): string {
    const start = this.currentWeekStart;
    const end = new Date(start);
    end.setDate(start.getDate() + 4); // Obtiene el domingo de la misma semana
    return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;
  }
  
  async addEmployee() {
    if (!this.newEmployeeName || this.newEmployeeRate <= 0) {
      alert('Por favor, ingresa un nombre y una tarifa válida.');
      return;
    }
  
    const newEmployee: Empleados = {
      id: crypto.randomUUID(),
      name: this.newEmployeeName,
      hourlyRate: this.newEmployeeRate,
      activo: true, // Los nuevos empleados son activos por defecto
    };
  
    try {
      const response = await this._supabaseServices.addEmployee(newEmployee);
      if (response.error) {
        console.error('Error al agregar empleado:', response.error);
      } else {
        this.employees.push(newEmployee); // Actualiza localmente
        this.newEmployeeName = '';
        this.newEmployeeRate = 0;
        alert('Empleado agregado correctamente.');
      }
    } catch (error) {
      console.error('Error inesperado al agregar empleado:', error);
    }
  }

  async updateEmployee(employee: Empleados) {
    try {
      const response = await this._supabaseServices.updateEmployee(employee);
      if (response.error) {
        console.error('Error al actualizar empleado:', response.error);
      } else {
     /*    console.log('Empleado actualizado:', employee); */
      }
    } catch (error) {
      console.error('Error inesperado al actualizar empleado:', error);
    }
  }

  async deleteEmployee(employee: Empleados): Promise<void> {
    const confirmDelete = confirm(
      `¿Estás seguro de que deseas eliminar al empleado ${employee.name}?`
    );

    if (!confirmDelete) {
      return; // Si el usuario cancela, no se realiza ninguna acción
    }

    try {
      // Llamar al servicio para eliminar el empleado
      await this._supabaseServices.deleteEmployeeById(employee.id);

      // Actualizar la lista local de empleados
      this.ngOnInit();

      alert(`Empleado ${employee.name} eliminado con éxito.`);
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      alert('Ocurrió un error al intentar eliminar al empleado. Por favor, intenta de nuevo.');
    }
  }
  

  async toggleEmployeeStatus(employee: Empleados) {
    employee.activo = !employee.activo;
    await this.updateEmployee(employee);
  }

  get activeEmployees(): Empleados[] {
    return this.employees.filter((e) => e.activo);
  }
  
  get sortedEmployees(): Empleados[] {
    return [...this.employees].sort((a, b) => {
      if (a.activo === b.activo) return 0; // Mantener el orden si ambos tienen el mismo estado
      return a.activo ? -1 : 1; // Activos primero
    });
  }


  async generatePDF() {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pdfElement:any = document.getElementById('pdf-template');
    
    // Mostrar temporalmente el template
    pdfElement.style.display = 'block';
    
    const options = {
      scale: 2,
      useCORS: true,
      logging: true,
      width: 210, // Ancho A4 en mm
      windowWidth: 210 * 3.78, // Convertir a pixels
      onclone: (clonedDoc:any) => {
        // Aplicar estilos específicos para impresión
        clonedDoc.getElementById('pdf-template').style.cssText = `
          position: absolute;
          left: 0;
          top: -9999px;
          width: 210mm;
        `;
      }
    };
  
    const canvas = await html2canvas(pdfElement, options);
    pdfElement.style.display = 'none';
  
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
    // Añadir páginas según sea necesario
    let heightLeft = imgHeight;
    let position = 0;
    
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // Altura A4 en mm
  
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }
  
    doc.save('resumen-mensual.pdf');
  }
  

  formatTimePDF(time: string): string {
    return time ? time.slice(0, 5) : '--:--';
  }

// Método para navegar entre años
navigateYear(offset: number) {
  this.currentYear += offset;
  this.generateMonthlySummary(); // Regenerar el resumen mensual al cambiar de año
}

// Método para seleccionar un mes
selectMonth(monthIndex: number) {
  this.currentMonth = monthIndex;
  this.loadCurrentMonth();
  this.generateMonthlySummary();
}

// Método para verificar si un empleado tiene horarios vacíos en toda la semana
hasEmptyWeek(employeeId: string, week: any): boolean {
  const isEmpty = week.days.every((day: any) => {
    const schedule = day.schedules[employeeId];
   /*  console.log('Horario de Diana:', schedule); */ // Verifica esto
    return (!schedule || (schedule.entry === '00:00' && schedule.exit === '00:00'));
  });
  return isEmpty;
}

// Método para obtener empleados con horarios válidos en la semana
getFilteredEmployees(week: any): Empleados[] {
 /*  console.log('Todos los empleados:', this.allEmployees); */
  const filteredEmployees = this.allEmployees.filter(employee => !this.hasEmptyWeek(employee.id, week));
/*   console.log('Empleados filtrados:', filteredEmployees); */
  return filteredEmployees;
}

// Método de Generación de PDF Optimizado
async generateHighQualityPDF() {
  const pdfElement:any = document.getElementById('pdf-template');
  pdfElement.style.display = 'block';
  
  const options = {
    scale: 3.78, // 1mm = 3.78px
    width: 794,  // 210mm * 3.78 = 794px
    height: pdfElement.scrollHeight,
    useCORS: true,
    logging: true,
    backgroundColor: '#ffffff',
    onclone: (clonedDoc:any) => {
      clonedDoc.documentElement.style.visibility = 'hidden';
      clonedDoc.getElementById('pdf-template').style.visibility = 'visible';
    }
  };

  const canvas = await html2canvas(pdfElement, options);
  pdfElement.style.display = 'none';

  const doc = new jsPDF('p', 'mm', 'a4');
  const imgData = canvas.toDataURL('image/png', 1.0);
  
  // Calcular dimensiones exactas
  const pageHeight = 297; // Altura A4 en mm
  const imgWidth = 210;   // Ancho A4
  const imgHeight = (imgWidth * canvas.height) / canvas.width;
  
  let position = 0;
  
  // Añadir páginas según sea necesario
  while (position < imgHeight) {
    if (position > 0) doc.addPage();
    doc.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);
    position += pageHeight;
  }

  doc.save('horarios-profesional.pdf');
}
  
}
