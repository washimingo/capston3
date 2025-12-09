import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';


export interface HeaderButton {
  icon: string;
  action: string;
  class?: string;
  iconOnly?: boolean;
  badge?: string | number;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    IonicModule
]
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() titleIcon?: string;
  @Input() shadowClass: string = '';
  @Input() titleClass: string = 'text-xl font-bold';
  @Input() titleContainerClass: string = 'flex items-center';
  @Input() endButtons?: HeaderButton[] = [];
  @Output() buttonClick = new EventEmitter<string>();

  onButtonClick(action: string) {
    this.buttonClick.emit(action);
  }
}