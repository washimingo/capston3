import { CommonModule } from "@angular/common";
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { 
  IonContent, 
  IonButtons, 
  IonButton, 
  IonIcon, 
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonSearchbar,
  IonModal,
  IonItem,
  IonLabel,
  IonList
} from "@ionic/angular/standalone";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { addIcons } from 'ionicons';
import { 
  searchOutline,
  bookmarkOutline,
  helpCircleOutline,
  cloudUploadOutline,
  documentTextOutline,
  settingsOutline,
  barChartOutline,
  filterOutline,
  alertCircleOutline,
  shieldCheckmarkOutline,
  timeOutline,
  eyeOutline,
  arrowForwardOutline,
  playCircleOutline,
  checkmarkCircleOutline,
  starOutline,
  trendingUpOutline,
  bulbOutline,
  schoolOutline,
  closeOutline,
  menuOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    HeaderComponent,
    IonContent, 
    IonButtons, 
    IonButton, 
    IonIcon, 
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonChip,
    IonGrid,
    IonRow,
    IonCol,
    IonSearchbar,
    IonModal,
    IonItem,
    IonLabel,
    IonList,
    CommonModule, 
    FormsModule
  ]
})
export class TipsPage implements OnInit, AfterViewInit {

  // Configuración del header
  headerButtons = [
    {
      icon: 'search-outline',
      action: 'search',
      class: 'text-white'
    },
    {
      icon: 'bookmark-outline', 
      action: 'bookmark',
      class: 'text-white'
    }
  ];

  // Estado del modal
  selectedTutorial: any = null;
  isModalOpen = false;
  searchQuery = '';

  // Categorías de tutoriales
  categories = [
    { name: 'Todos', value: 'all', active: true },
    { name: 'Básico', value: 'basic', active: false },
    { name: 'Intermedio', value: 'intermediate', active: false },
    { name: 'Avanzado', value: 'advanced', active: false }
  ];

  // Quick actions for hero section
  quickActions = [
    {
      title: 'Nueva Factura',
      desc: 'Crear factura paso a paso',
      icon: 'document-text-outline',
      color: 'emerald'
    },
    {
      title: 'Filtros Avanzados',
      desc: 'Búsqueda inteligente',
      icon: 'filter-outline',
      color: 'blue'
    },
    {
      title: 'Reportes',
      desc: 'Análisis y gráficos',
      icon: 'bar-chart-outline',
      color: 'purple'
    },
    {
      title: 'Configuración',
      desc: 'Personalizar sistema',
      icon: 'settings-outline',
      color: 'orange'
    }
  ];

  // Tutoriales con toda la información
  tutorials = [
    {
      id: 1,
      title: 'Cómo Cargar una Factura',
      description: 'Aprende el proceso completo para subir facturas al sistema de manera eficiente',
      category: 'basic',
      duration: '5 min',
      difficulty: 'Básico',
      rating: 4.8,
      views: 1247,
      icon: 'cloudUploadOutline',
      color: 'emerald',
      steps: [
        'Accede al módulo de facturas desde el menú principal',
        'Haz clic en el botón "Nueva Factura"',
        'Completa los campos obligatorios: Folio, Proveedor, Monto',
        'Selecciona el tipo de factura y estado inicial',
        'Adjunta el archivo PDF si está disponible',
        'Verifica la información y guarda la factura'
      ],
      tips: [
        'Asegúrate de que el PDF sea legible',
        'Verifica los datos antes de guardar',
        'Usa el autocompletado para proveedores frecuentes'
      ]
    },
    {
      id: 2,
      title: 'Filtros Avanzados de Facturas',
      description: 'Domina las herramientas de búsqueda y filtrado para encontrar facturas específicas',
      category: 'intermediate',
      duration: '8 min',
      difficulty: 'Intermedio',
      rating: 4.6,
      views: 892,
      icon: 'filterOutline',
      color: 'blue',
      steps: [
        'Accede a la página de gestión de facturas',
        'Utiliza la barra de búsqueda por folio o proveedor',
        'Aplica filtros por estado (pendiente, pagada, vencida)',
        'Filtra por rango de fechas específico',
        'Combina múltiples filtros para búsquedas precisas',
        'Guarda filtros frecuentes como favoritos'
      ],
      tips: [
        'Los filtros se pueden combinar',
        'Usa fechas relativas como "últimos 30 días"',
        'Guarda búsquedas frecuentes'
      ]
    },
    {
      id: 3,
      title: 'Generación de Reportes',
      description: 'Crea reportes detallados y visualizaciones de datos para análisis financiero',
      category: 'intermediate',
      duration: '12 min',
      difficulty: 'Intermedio',
      rating: 4.9,
      views: 654,
      icon: 'barChartOutline',
      color: 'purple',
      steps: [
        'Ve a la sección de Reportes desde el menú',
        'Selecciona el tipo de reporte (mensual, anual, por proveedor)',
        'Define el período de análisis',
        'Configura los parámetros del reporte',
        'Genera vista previa del reporte',
        'Exporta en formato PDF o Excel'
      ],
      tips: [
        'Los reportes se pueden programar automáticamente',
        'Usa gráficos para presentaciones',
        'Exporta en múltiples formatos'
      ]
    },
    {
      id: 4,
      title: 'Configuración de Alertas',
      description: 'Establece notificaciones inteligentes para facturas vencidas y próximas a vencer',
      category: 'advanced',
      duration: '10 min',
      difficulty: 'Avanzado',
      rating: 4.7,
      views: 432,
      icon: 'alertCircleOutline',
      color: 'orange',
      steps: [
        'Accede a Configuración > Alertas',
        'Define criterios de alerta (días antes de vencimiento)',
        'Configura destinatarios de notificaciones',
        'Establece frecuencia de recordatorios',
        'Personaliza mensajes de alerta',
        'Activa y prueba las alertas configuradas'
      ],
      tips: [
        'Configura múltiples tipos de alertas',
        'Prueba las notificaciones antes de activarlas',
        'Ajusta la frecuencia según necesidades'
      ]
    },
    {
      id: 5,
      title: 'Seguridad y Respaldos',
      description: 'Protege tu información con medidas de seguridad y sistemas de backup automático',
      category: 'advanced',
      duration: '15 min',
      difficulty: 'Avanzado',
      rating: 4.5,
      views: 321,
      icon: 'shieldCheckmarkOutline',
      color: 'red',
      steps: [
        'Configura contraseñas seguras para usuarios',
        'Establece permisos por rol de usuario',
        'Configura backup automático de datos',
        'Verifica la integridad de los respaldos',
        'Establece política de retención de datos',
        'Documenta procedimientos de recuperación'
      ],
      tips: [
        'Realiza backups regulares',
        'Prueba la restauración periódicamente',
        'Mantén backups en ubicaciones seguras'
      ]
    },
    {
      id: 6,
      title: 'Optimización del Sistema',
      description: 'Mejora el rendimiento y personaliza el sistema según tus necesidades específicas',
      category: 'advanced',
      duration: '20 min',
      difficulty: 'Avanzado',
      rating: 4.4,
      views: 278,
      icon: 'trendingUpOutline',
      color: 'teal',
      steps: [
        'Analiza el uso actual del sistema',
        'Identifica procesos que se pueden automatizar',
        'Configura plantillas para facturas frecuentes',
        'Optimiza la base de datos',
        'Configura integración con otros sistemas',
        'Establece métricas de rendimiento'
      ],
      tips: [
        'Automatiza tareas repetitivas',
        'Monitorea el rendimiento regularmente',
        'Mantén el sistema actualizado'
      ]
    }
  ];

  constructor(private router: Router) {
    addIcons({chevronBackOutline,chevronForwardOutline,timeOutline,eyeOutline,starOutline,playCircleOutline,searchOutline,bookmarkOutline,helpCircleOutline,cloudUploadOutline,documentTextOutline,settingsOutline,barChartOutline,filterOutline,alertCircleOutline,shieldCheckmarkOutline,arrowForwardOutline,checkmarkCircleOutline,trendingUpOutline,bulbOutline,schoolOutline,closeOutline,menuOutline});
  }

  ngOnInit(): void {
  }

  // Filtrar tutoriales por categoría
  filterByCategory(category: string) {
    this.categories.forEach(cat => cat.active = cat.value === category);
  }

  // Obtener tutoriales filtrados
  getFilteredTutorials() {
    const activeCategory = this.categories.find(cat => cat.active)?.value;
    let filtered = this.tutorials;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(tutorial => tutorial.category === activeCategory);
    }

    if (this.searchQuery) {
      filtered = filtered.filter(tutorial => 
        tutorial.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    return filtered;
  }

  // Abrir modal con tutorial específico
  openTutorialModal(tutorial: any) {
    this.selectedTutorial = tutorial;
    this.isModalOpen = true;
  }

  // Cerrar modal
  closeModal() {
    this.isModalOpen = false;
    this.selectedTutorial = null;
  }

  // Navegar a páginas específicas
  navigateToInvoices() {
    this.router.navigate(['/invoices']);
  }

  navigateToReports() {
    this.router.navigate(['/reports']);
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }

  // Manejar acciones rápidas
  handleQuickAction(action: any) {
    switch (action.title) {
      case 'Nueva Factura':
      case 'Filtros Avanzados':
        this.navigateToInvoices();
        break;
      case 'Reportes':
        this.navigateToReports();
        break;
      case 'Configuración':
        this.navigateToSettings();
        break;
    }
  }

  // Funciones para el carrusel
  goToSlide(index: number) {
    const swiperEl = document.querySelector('swiper-container') as any;
    if (swiperEl && swiperEl.swiper) {
      swiperEl.swiper.slideTo(index);
      this.updatePaginationDots(index);
    }
  }

  updatePaginationDots(activeIndex: number) {
    const dots = document.querySelectorAll('.pagination-dot');
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Inicializar el carrusel después de que la vista se cargue
  ngAfterViewInit() {
    // Configurar eventos del carrusel
    setTimeout(() => {
      const swiperEl = document.querySelector('swiper-container') as any;
      if (swiperEl) {
        swiperEl.addEventListener('swiperslidechange', (event: any) => {
          this.updatePaginationDots(event.detail[0].activeIndex % this.tutorials.length);
        });
      }
    }, 100);
  }

  // Obtener el icono por nombre
  getIcon(iconName: string) {
    const iconMap: any = {
      cloudUploadOutline,
      'cloud-upload-outline': cloudUploadOutline,
      filterOutline,
      'filter-outline': filterOutline,
      barChartOutline,
      'bar-chart-outline': barChartOutline,
      alertCircleOutline,
      'alert-circle-outline': alertCircleOutline,
      shieldCheckmarkOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      trendingUpOutline,
      'trending-up-outline': trendingUpOutline
    };
    return iconMap[iconName] || helpCircleOutline;
  }

  // Manejar clicks del header
  onHeaderButtonClick(action: string) {
    switch(action) {
      case 'search':
        // Lógica para buscar
        console.log('Buscar clicked');
        break;
      case 'bookmark':
        // Lógica para favoritos
        console.log('Bookmark clicked');
        break;
      default:
        console.log('Action not handled:', action);
    }
  }
}