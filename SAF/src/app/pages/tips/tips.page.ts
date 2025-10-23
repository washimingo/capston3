import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Tutorial, TutorialCategory, ViewMode } from '../../interfaces/tutorial';
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
    FormsModule
  ]
})
export class TipsPage implements OnInit {

  // Datos
  tutorials: Tutorial[] = TUTORIALS_DATA;
  filteredTutorials: Tutorial[] = this.tutorials;
  
  // Filtros
  searchTerm: string = '';
  selectedCategory: TutorialCategory = 'all';
  selectedDifficulty: string = 'all';
  
  // Vista
  viewMode: ViewMode = 'grid';

  router = inject(Router);

  ngOnInit(): void {
    this.filterTutorials();
  }

  // Métodos de estadísticas
  getTotalTutorials(): number {
    return this.tutorials.length;
  }

  getAverageProgress(): number {
    if (this.tutorials.length === 0) return 0;
    const totalProgress = this.tutorials.reduce((sum, tutorial) => sum + tutorial.progress, 0);
    return Math.round(totalProgress / this.tutorials.length);
  }

  getTotalDuration(): number {
    return this.tutorials.reduce((sum, tutorial) => sum + tutorial.duration, 0);
  }

  // Métodos de filtrado
  filterTutorials(): void {
    this.filteredTutorials = this.tutorials.filter(tutorial => {
      const matchesSearch = tutorial.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           tutorial.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = this.selectedCategory === 'all' || tutorial.category === this.selectedCategory;
      
      const matchesDifficulty = this.selectedDifficulty === 'all' || tutorial.difficulty === this.selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }

  // Métodos de vista
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  // Métodos de utilidad
  getTutorialColorClass(color: string): string {
    const colorClasses = {
      blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
      green: 'bg-gradient-to-br from-green-500 to-green-600',
      purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
      orange: 'bg-gradient-to-br from-orange-500 to-orange-600',
      red: 'bg-gradient-to-br from-red-500 to-red-600',
      teal: 'bg-gradient-to-br from-teal-500 to-teal-600'
    };
    return colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;
  }

  getDifficultyClass(difficulty: string): string {
    const difficultyClasses = {
      principiante: 'bg-green-100 text-green-800',
      intermedio: 'bg-yellow-100 text-yellow-800',
      avanzado: 'bg-red-100 text-red-800'
    };
    return difficultyClasses[difficulty as keyof typeof difficultyClasses] || difficultyClasses.principiante;
  }

  getCompletedSteps(tutorial: Tutorial): number {
    return tutorial.steps.filter(step => step.completed).length;
  }

  // Métodos de navegación
  openTutorial(tutorial: Tutorial): void {
    console.log('Abrir tutorial:', tutorial.title);
    // Aquí se podría navegar a una página de detalle del tutorial
    // this.router.navigate(['/tutorial', tutorial.id]);
  }
}