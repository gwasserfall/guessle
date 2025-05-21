import { Component, HostListener, signal } from '@angular/core';
import { LetterComponent } from '../letter/letter.component';
import { CommonModule } from '@angular/common';
import { LetterState } from '../../shared/letterState';
import { KeyboardComponent } from '../keyboard/keyboard.component';
import { HttpClient } from '@angular/common/http';
import { selectRandom } from '../../shared/helpers';

export class Letter {
  char: string = ''
  state: LetterState = LetterState.Unchecked

  toString() {
    return `<${this.char}>`
  }
}


@Component({
  selector: 'app-game',
  imports: [CommonModule, LetterComponent, KeyboardComponent],
  providers: [HttpClient],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
  public solution: string = "test"
  public wordLength: number = 1;

  public activeCol: number = 0;
  public activeRow: number = 0;
  public allowedGuessCount = 5;
  public gameboard: {[key: number]: Letter[]} = {}


  gameComplete: boolean = false;

  startGame() {
    this.gameComplete = false;
    this.activeCol = 0;
    this.activeRow = 0;
    this.gameboard = {};

    this.http.get('/puzzle-words-5-ordered.txt', { responseType: 'text' }).subscribe((data: any) => {

      let words = data.split('\n').map((word: string) => word.trim().toUpperCase());

      const today = new Date();
      const seed = today.toISOString().slice(0, 10);
      const index = selectRandom(0, words.length, seed);
      this.solution = words[index].toUpperCase();

      for (let i = 0; i < this.allowedGuessCount; i++) {
        this.gameboard[i] = [];
        for (let j = 0; j < this.solution.length; j++) {
          this.gameboard[i].push(new Letter())
        }
      }
      this.wordLength = this.solution.length;

    });

  }

  dictionary: string[] = [];

  constructor(private http: HttpClient) {

    this.http.get('/dictionary.txt', { responseType: 'text' }).subscribe((data: any) => {
      let words = data.split('\n');
      this.dictionary = words.map((word: string) => word.trim().toUpperCase())
    })


    this.startGame();
  }

  checkDictionary() {}

  @HostListener('window:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {

    if (this.gameComplete) {
      return;
    }

    this.error = '';

    if (/^[a-zA-Z]$/.test(event.key) && this.activeCol < this.wordLength) {
      this.gameboard[this.activeRow][this.activeCol++].char = event.key.toUpperCase();
    } else if (event.key === 'Backspace' && this.activeCol > 0) {
      this.gameboard[this.activeRow][--this.activeCol].char = ''
    } else if (event.key === 'Enter' && this.activeCol === this.wordLength) {

      let guess = this.gameboard[this.activeRow].map((letter: Letter) => letter.char).join('');
      if (!this.dictionary.includes(guess)) {
        this.error = 'Not in dictionary';
        return;
      }


      

      this.checkActiveRow();
      this.activeCol = 0;
      this.activeRow++;
    }

    this.checkGameComplete();
  }

  error: string = '';

  checkActiveRow() {
    let check: Letter[] = [...this.gameboard[this.activeRow]]
    let solution = this.solution.split('');

    // Check for correct letters in correct place
    for (let i = 0; i < check.length; i++) {
      let letter = check[i];
      if (solution[i] == letter.char) { 
        letter.state = LetterState.CorrectPosition;
        solution[i] = '-'
      }
    }

    // Check for correct letters in remaining solution
    for (let i = 0; i < check.length; i++) {
      let letter = check[i];
      if (letter.state === LetterState.CorrectPosition)
        continue;

      if (solution.includes(letter.char)) {
          letter.state = LetterState.CorrectLetter;
          solution[solution.indexOf(letter.char)] = "-";
        } else {
          letter.state = LetterState.NotInSolution;
        }
    }

    this.gameboard[this.activeRow] = check;
  
  }

  checkGameComplete() {
    if (this.activeRow >= this.allowedGuessCount) {
      this.gameComplete = true;
      return;
    }
    for (let i = 0; i < this.wordLength; i++) {
      if (this.gameboard[this.activeRow][i].state !== LetterState.CorrectPosition) {
        return;
      }
    }
    this.gameComplete = true;
  }

  ngOnInit(): void {
    this.solution = this.solution.toUpperCase();
  }
}