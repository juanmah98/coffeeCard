import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UsuarioChart } from 'src/app/interfaces/usuarios-chart';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})


export class ChartComponent implements OnInit {

  constructor(private supabaseService: SupabaseService, private cdr: ChangeDetectorRef) { }
  public userGrowthConfig: any;
  public qrUsageConfig: any;
  public selectedYear: number=2025;
  private meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  private usuarios: UsuarioChart[] = [];
  public usuariosTotales = 0;
  async ngOnInit() {

  /*   const userCounts = [30, 45, 80, 110];
    const userCounts2 = [5, 15, 30, 20]; */

    // Datos de ejemplo: QR generados y usados por mes
 /*    const qrGenerated = [300, 350, 400, 421];
    const qrUsed      = [120, 150, 180, 190]; */

    const usuarios: UsuarioChart[] = await this.supabaseService.getUsuariosPorPais();
    this.usuariosTotales = usuarios.length;
/*     console.log(usuarios) */
    this.usuarios = usuarios;
   await this.updateChart()
    // 2) Transformar: agrupar por país y por mes de creación
    




    // Configuración del gráfico de barras comparativas
    /* this.qrUsageConfig = {
      type: 'bar',
      title: {
        text: 'QR Generados vs. Usados'
      },
      scaleX: {
        labels: months
      },
      series: [
        {
          values: qrGenerated,
          text: 'Generados'
        },
        {
          values: qrUsed,
          text: 'Usados'
        }
      ]
    }; */
    /* this.cdr.detectChanges(); */
  }

    // Llama cuando cambie el año
    changeYear(delta: number) {
      this.selectedYear += delta;
      this.updateChart();
    }


  private updateChart() {
    const contarPorMes = (pais: 'españa' | 'argentina') => {
      const counts = Array(12).fill(0);
      this.usuarios
        .filter(u => u.pais === pais &&
          new Date(u.fecha_creacion).getFullYear() === this.selectedYear)
        .forEach(u => {
          const mes = new Date(u.fecha_creacion).getMonth();
          counts[mes]++;
        });
      return counts;
    };

    const espCounts = contarPorMes('españa');
    const argCounts = contarPorMes('argentina');
    this.userGrowthConfig = {
      type: 'line',
      theme: 'dark',  // Tema oscuro nativo
      backgroundColor: 'transparent',
      title: {
        text: 'Crecimiento de Usuarios (YTD)',
        fontColor: '#fff',
        fontSize: '18px'
      },
      legend: {
        align: 'center',
        valign: 'top',
        backgroundColor: 'transparent',
        layout: '1x2',
        margin: '35px',
        header: { 
          align: 'center',
          text: 'Comparativa por región',
          fontColor: '#fff',
          fontSize: '14px'
        },
        item: {
          fontColor: '#eee',
          fontSize: '12px',
          padding: '5px'
        },
        marker: {
          type: 'circle',
          borderColor: '#fff',
          borderWidth: 2,
          size: 8
        }
      },
      plot: {
        lineWidth: 3,
        marker: {
          size: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        tooltip: {
          text: '%t: %v',
          fontColor: '#000',
          backgroundColor: '#fff',
          borderColor: '#888',
          borderRadius: 4,
          padding: '5px'
        },
        highlightState: {
          visible: true,
          lineWidth: 4
        }
      },
      scaleX: {
        labels: this.meses,
        item: {
          fontColor: '#bbb',
          fontSize: '12px'
        },
        tick: {
          lineColor: '#555'
        }
      },
      scaleY: {
        label: { 
          text: 'Usuarios',
          fontColor: '#bbb',
          fontSize: '12px'
        },
        item: {
          fontColor: '#bbb',
          fontSize: '12px'
        },
        tick: {
          lineColor: '#555'
        }
      },
      series: [
        {
          values: argCounts,
          text: 'Usuarios Argentina',
          lineColor: '#40beeb'
        },
        {
          values: espCounts,
          text: 'Usuarios España',
          lineColor: '#ff7900'
        }
      ]
    };
}
}
