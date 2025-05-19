import { Component, HostListener } from '@angular/core';
import { LetterComponent } from '../letter/letter.component';
import { GuessRowComponent } from '../guess-row/guess-row.component';

@Component({
  selector: 'app-game',
  imports: [LetterComponent, GuessRowComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
  public solution: string = "bladerunner"
  public wordLength: number = this.solution.length;
  public guesses: string[][] = []
  public guess = Array(this.wordLength).fill("");

  private activeIndex: number = 0;

  @HostListener('window:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {

    if (/^[a-zA-Z]$/.test(event.key) && this.activeIndex < this.wordLength) {
      this.guess[this.activeIndex++] = event.key.toUpperCase();
    } else if (event.key === 'Backspace' && this.activeIndex > 0) {
      this.guess[--this.activeIndex] = ''
    } else if (event.key === 'Enter' && this.activeIndex === this.wordLength) {
      this.guesses.unshift([...this.guess]);
      this.guess = Array(this.wordLength).fill('');
      this.activeIndex = 0;
    }
  }

  ngOnInit(): void {
    this.solution = this.solution.toUpperCase();
  }
}
