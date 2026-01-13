import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  // Iconos de navegación y UI básica
  arrowBackOutline,
  arrowForwardOutline,
  chevronBackOutline,
  chevronForwardOutline,
  chevronDownOutline,
  chevronUpOutline,
  closeOutline,
  close,
  closeCircle,
  closeCircleOutline,
  contractOutline,
  expandOutline,
  swapHorizontalOutline,
  
  // Iconos de documentos y archivos
  documentTextOutline,
  documentOutline,
  cloudUploadOutline,
  downloadOutline,
  
  // Iconos de tiempo y fechas
  timeOutline,
  calendarOutline,
  calendarNumberOutline,
  hourglassOutline,
  alarmOutline,
  
  // Iconos de estados y acciones
  checkmarkOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  warningOutline,
  
  // Iconos de análisis y reportes
  analyticsOutline,
  barChartOutline,
  pieChartOutline,
  trendingUpOutline,
  trophyOutline,
  eyeOutline,
  
  // Iconos de configuración
  settingsOutline,
  cogOutline,
  optionsOutline,
  filterOutline,
  funnel,
  
  // Iconos de personas y negocio
  peopleOutline,
  personOutline,
  personCircleOutline,
  businessOutline,
  briefcaseOutline,
  
  // Iconos de comunicación
  mailOutline,
  callOutline,
  notificationsOutline,
  phonePortraitOutline,
  
  // Iconos de acciones generales
  createOutline,
  listOutline,
  searchOutline,
  refreshOutline,
  saveOutline,
  
  // Iconos de información y ayuda
  informationCircleOutline,
  helpCircleOutline,
  bulbOutline,
  libraryOutline,
  
  // Iconos especiales
  speedometerOutline,
  cashOutline,
  flagOutline,
  cardOutline,
  camera,
  logOutOutline,
  
  // Iconos de medios
  playOutline,
  volumeHighOutline,
  volumeMediumOutline,
  volumeLowOutline,
  musicalNotesOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
  standalone: true
})
export class IconsComponent {
  constructor() {
    // Registrar todos los iconos utilizados en el proyecto
    addIcons({
      // Navegación y UI básica
      arrowBackOutline,
      arrowForwardOutline,
      chevronBackOutline,
      chevronForwardOutline,
      chevronDownOutline,
      chevronUpOutline,
      closeOutline,
      close,
      closeCircle,
      closeCircleOutline,
      contractOutline,
      expandOutline,
      swapHorizontalOutline,
      
      // Documentos y archivos
      documentTextOutline,
      documentOutline,
      cloudUploadOutline,
      downloadOutline,
      
      // Tiempo y fechas
      timeOutline,
      calendarOutline,
      calendarNumberOutline,
      hourglassOutline,
      alarmOutline,
      
      // Estados y acciones
      checkmarkOutline,
      checkmarkCircleOutline,
      alertCircleOutline,
      warningOutline,
      
      // Análisis y reportes
      analyticsOutline,
      barChartOutline,
      pieChartOutline,
      trendingUpOutline,
      trophyOutline,
      eyeOutline,
      
      // Configuración
      settingsOutline,
      cogOutline,
      optionsOutline,
      filterOutline,
      funnel,
      
      // Personas y negocio
      peopleOutline,
      personOutline,
      personCircleOutline,
      businessOutline,
      briefcaseOutline,
      
      // Comunicación
      mailOutline,
      callOutline,
      notificationsOutline,
      phonePortraitOutline,
      
      // Acciones generales
      createOutline,
      listOutline,
      searchOutline,
      refreshOutline,
      saveOutline,
      
      // Información y ayuda
      informationCircleOutline,
      helpCircleOutline,
      bulbOutline,
      libraryOutline,
      
      // Especiales
      speedometerOutline,
      cashOutline,
      flagOutline,
      cardOutline,
      camera,
      logOutOutline,
      
      // Medios
      playOutline,
      volumeHighOutline,
      volumeMediumOutline,
      volumeLowOutline,
      musicalNotesOutline
    });
  }
}
