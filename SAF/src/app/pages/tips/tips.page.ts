import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from '../../components/header/header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { 
  IonContent, 
  IonSearchbar, 
  IonChip, 
  IonLabel, 
  IonButton, 
  IonIcon, 
  IonModal, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  bookOutline,
  checkmarkCircleOutline,
  timeOutline,
  rocketOutline,
  documentTextOutline,
  analyticsOutline,
  settingsOutline,
  barChartOutline,
  notificationsOutline,
  searchOutline,
  gridOutline,
  listOutline,
  playOutline,
  closeOutline,
  refreshOutline,
  checkmarkCircle,
  ellipseOutline,
  personOutline,
  schoolOutline
} from 'ionicons/icons';

// Import interfaces and data
import{ Tutorial, TutorialCategory, ViewMode } from '../../interfaces/tutorial';
import { TUTORIALS_DATA } from '../../data/tutorials.data';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    HeaderComponent,
    CommonModule, 
    FormsModule,
    IonContent,
    IonSearchbar,
    IonChip,
    IonLabel,
    IonButton,
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons
  ]
})
export class TipsPage implements OnInit {
  
  constructor() {
    // Register all required icons
    addIcons({
      'book-outline': bookOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'time-outline': timeOutline,
      'rocket-outline': rocketOutline,
      'document-text-outline': documentTextOutline,
      'analytics-outline': analyticsOutline,
      'settings-outline': settingsOutline,
      'bar-chart-outline': barChartOutline,
      'notifications-outline': notificationsOutline,
      'search-outline': searchOutline,
      'grid-outline': gridOutline,
      'list-outline': listOutline,
      'play-outline': playOutline,
      'close': closeOutline,
      'refresh-outline': refreshOutline,
      'checkmark-circle': checkmarkCircle,
      'ellipse-outline': ellipseOutline,
      'person-outline': personOutline,
      'school-outline': schoolOutline
    });
  }
  
  // Search and filter properties
  searchTerm: string = '';
  selectedCategory: TutorialCategory = 'all';
  viewMode: ViewMode = 'grid';
  
  // Modal properties
  isModalOpen: boolean = false;
  selectedTutorial: Tutorial | null = null;
  
  // Tutorial data from external file
  tutorials: Tutorial[] = TUTORIALS_DATA;

  ngOnInit() {
    // Initialize component
  }

  // Computed properties
  get totalTutorials(): number {
    return this.tutorials.length;
  }

  get completedTutorials(): number {
    return this.tutorials.filter(t => t.progress === 100).length;
  }

  get estimatedTime(): number {
    const totalTime = this.tutorials.reduce((sum, tutorial) => sum + tutorial.duration, 0);
    return Math.round(totalTime / this.tutorials.length);
  }

  // Search and filter methods
  onSearchChange(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
  }

  selectCategory(category: TutorialCategory): void {
    this.selectedCategory = category;
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
  }

  getFilteredTutorials(): Tutorial[] {
    let filtered = this.tutorials;

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(tutorial => tutorial.category === this.selectedCategory);
    }

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(tutorial =>
        tutorial.title.toLowerCase().includes(this.searchTerm) ||
        tutorial.description.toLowerCase().includes(this.searchTerm) ||
        tutorial.category.toLowerCase().includes(this.searchTerm)
      );
    }

    return filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'all';
  }

  // Modal methods
  openTutorial(tutorial: Tutorial): void {
    this.selectedTutorial = tutorial;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedTutorial = null;
  }

  startTutorial(tutorial: Tutorial): void {
    // Here you would implement the tutorial start logic
    console.log('Starting tutorial:', tutorial.title);
    // You could navigate to a tutorial detail page or start an interactive tutorial
    this.closeModal();
  }
}