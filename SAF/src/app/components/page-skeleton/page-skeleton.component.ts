import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-page-skeleton',
  templateUrl: './page-skeleton.component.html',
  styleUrls: ['./page-skeleton.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonSpinner
  ]
})
export class PageSkeletonComponent {
}
