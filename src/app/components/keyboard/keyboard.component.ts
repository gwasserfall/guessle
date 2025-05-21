import { Component, Host, HostListener, signal, Signal, WritableSignal } from '@angular/core';

export class Test {
  value: string = 'Initial value';
}

@Component({
  selector: 'app-keyboard',
  imports: [],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.css'
})
export class KeyboardComponent {
  public testSignal: WritableSignal<any>[][];

  constructor() {
    this.testSignal = [[signal<string>('1'), signal<string>('2'), signal<string>('3'), signal<string>('4')]];
  }


  @HostListener('window:click', ['$event'])
  clickHandler(event: MouseEvent) {
    console.log('Click event detected:', event);

    for (let i = 0; i < this.testSignal.length; i++) {
      const row = this.testSignal[i];
      for (const signal of row) {
        signal.set('Clicked value: ' + signal()); 
      }
    }
  }
}
