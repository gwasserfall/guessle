import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LetterComponent } from '../letter/letter.component';
import { LetterState } from '../../shared/letterState';

export interface Letter {
  character: string;
  state: LetterState;
}

@Component({
  selector: 'app-guess-row',
  imports: [LetterComponent],
  templateUrl: './guess-row.component.html',
  styleUrl: './guess-row.component.css'
})
export class GuessRowComponent implements OnChanges {
  
  @Input() guess: string[] = [];
  @Input() solution: string = "";
  
  public results: Letter[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['guess']) {
      this.results = this.guess.map(x => ({ character: x, state: LetterState.Unchecked }));
      let solutionCheck: string[] = this.solution.split('');
      
      // Check for correct letters in correct place
      for (let i = 0; i < this.guess.length; i++) {
        let letter = this.guess[i];
        if (this.solution[i] === letter) {
          this.results[i].state = LetterState.CorrectPosition;
          solutionCheck[i] = "_"
        }
      }

      // Check for correct letters in remaining solution
      for (let i = 0; i < this.guess.length; i++) {

        if (this.results[i].state === LetterState.CorrectPosition)
          continue;

        let letter = this.guess[i];
        if (solutionCheck.includes(letter)) {
          this.results[i].state = LetterState.CorrectLetter;
          solutionCheck[solutionCheck.indexOf(letter)] = "_"
        } else {
          this.results[i].state = LetterState.NotInSolution;
        }
      }
    }
  }
}
