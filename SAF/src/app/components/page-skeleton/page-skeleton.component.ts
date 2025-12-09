import { Component } from '@angular/core';

import { IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-page-skeleton',
  templateUrl: './page-skeleton.component.html',
  styleUrls: ['./page-skeleton.component.scss'],
  standalone: true,
  imports: [
    IonSpinner
]
})
export class PageSkeletonComponent {
}
