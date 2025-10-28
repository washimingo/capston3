import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
  }

  // Mostrar por un tiempo mínimo para evitar parpadeos
  showWithMinimumDuration(minimumMs: number = 300) {
    this.show();
    setTimeout(() => {
      this.hide();
    }, minimumMs);
  }
}
