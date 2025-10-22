import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  // Iconos de navegación y UI básica
  arrowBackOutline,
  arrowForwardOutline,
  chevronBackOutline,
  chevronForwardOutline,
  chevronDown,
  homeOutline,
  menuOutline,
  closeOutline,
  close,
  closeCircle,
  closeCircleOutline,
  expandOutline,
  contractOutline,
  swapVerticalOutline,
  
  // Iconos de documentos y archivos
  documentTextOutline,
  documentOutline,
  documentText,
  receiptOutline,
  cloudUploadOutline,
  cloudDownloadOutline,
  downloadOutline,
  download,
  
  // Iconos de tiempo y fechas
  timeOutline,
  time,
  calendarOutline,
  calendar,
  calendarNumberOutline,
  alarmOutline,
  hourglassOutline,
  
  // Iconos de estados y acciones
  checkmarkOutline,
  checkmarkCircleOutline,
  checkmarkCircle,
  checkmarkDoneOutline,
  alertCircleOutline,
  warningOutline,
  
  // Iconos de análisis y reportes
  analyticsOutline,
  barChartOutline,
  pieChartOutline,
  statsChartOutline,
  trendingUpOutline,
  gridOutline,
  eyeOutline,
  
  // Iconos de configuración
  settingsOutline,
  settings,
  cogOutline,
  optionsOutline,
  constructOutline,
  filterOutline,
  funnelOutline,
  funnel,
  
  // Iconos de personas y negocio
  peopleOutline,
  personOutline,
  person,
  personCircleOutline,
  businessOutline,
  business,
  briefcaseOutline,
  
  // Iconos de comunicación
  mailOutline,
  mail,
  callOutline,
  call,
  notificationsOutline,
  notifications,
  phonePortraitOutline,
  
  // Iconos de acciones generales
  createOutline,
  create,
  trashOutline,
  addCircleOutline,
  listOutline,
  searchOutline,
  refreshOutline,
  saveOutline,
  printOutline,
  shareOutline,
  
  // Iconos de información y ayuda
  helpCircleOutline,
  helpCircle,
  informationCircleOutline,
  bulbOutline,
  schoolOutline,
  libraryOutline,
  bookmarkOutline,
  
  // Iconos de seguridad
  shieldCheckmarkOutline,
  shieldCheckmark,
  shieldOutline,
  
  // Iconos especiales
  flashOutline,
  sparklesOutline,
  trophyOutline,
  cubeOutline,
  cashOutline,
  flagOutline,
  speedometerOutline,
  cardOutline,
  cameraOutline,
  camera,
  
  // Iconos de medios
  playCircleOutline,
  playOutline,
  volumeHighOutline,
  volumeMediumOutline,
  volumeLowOutline,
  musicalNotesOutline,
  
  // Iconos de diseño
  moonOutline,
  colorPaletteOutline,
  languageOutline,
  starOutline,
  rocketOutline,
  
  // Iconos de acciones de usuario
  logOut,
  codeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
  standalone: true
})
export class IconsComponent {
  constructor() {
    // Registrar todos los iconos del proyecto de una sola vez
    addIcons({
      // Navegación y UI básica
      arrowBackOutline,
      arrowForwardOutline,
      chevronBackOutline,
      chevronForwardOutline,
      chevronDown,
      homeOutline,
      menuOutline,
      closeOutline,
      close,
      closeCircle,
      closeCircleOutline,
      expandOutline,
      contractOutline,
      swapVerticalOutline,
      
      // Documentos y archivos
      documentTextOutline,
      documentOutline,
      documentText,
      receiptOutline,
      cloudUploadOutline,
      cloudDownloadOutline,
      downloadOutline,
      download,
      
      // Tiempo y fechas
      timeOutline,
      time,
      calendarOutline,
      calendar,
      calendarNumberOutline,
      alarmOutline,
      hourglassOutline,
      
      // Estados y acciones
      checkmarkOutline,
      checkmarkCircleOutline,
      checkmarkCircle,
      checkmarkDoneOutline,
      alertCircleOutline,
      warningOutline,
      
      // Análisis y reportes
      analyticsOutline,
      barChartOutline,
      pieChartOutline,
      statsChartOutline,
      trendingUpOutline,
      gridOutline,
      eyeOutline,
      
      // Configuración
      settingsOutline,
      settings,
      cogOutline,
      optionsOutline,
      constructOutline,
      filterOutline,
      funnelOutline,
      funnel,
      
      // Personas y negocio
      peopleOutline,
      personOutline,
      person,
      personCircleOutline,
      businessOutline,
      business,
      briefcaseOutline,
      
      // Comunicación
      mailOutline,
      mail,
      callOutline,
      call,
      notificationsOutline,
      notifications,
      phonePortraitOutline,
      
      // Acciones generales
      createOutline,
      create,
      trashOutline,
      addCircleOutline,
      listOutline,
      searchOutline,
      refreshOutline,
      saveOutline,
      printOutline,
      shareOutline,
      
      // Información y ayuda
      helpCircleOutline,
      helpCircle,
      informationCircleOutline,
      bulbOutline,
      schoolOutline,
      libraryOutline,
      bookmarkOutline,
      
      // Seguridad
      shieldCheckmarkOutline,
      shieldCheckmark,
      shieldOutline,
      
      // Especiales
      flashOutline,
      sparklesOutline,
      trophyOutline,
      cubeOutline,
      cashOutline,
      flagOutline,
      speedometerOutline,
      cardOutline,
      cameraOutline,
      camera,
      
      // Medios
      playCircleOutline,
      playOutline,
      volumeHighOutline,
      volumeMediumOutline,
      volumeLowOutline,
      musicalNotesOutline,
      
      // Diseño
      moonOutline,
      colorPaletteOutline,
      languageOutline,
      starOutline,
      rocketOutline,
      
      // Acciones de usuario
      logOut,
      codeOutline
    });
  }
}
