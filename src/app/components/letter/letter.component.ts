import { Component, Input, OnInit } from '@angular/core';
import { LetterState } from '../../shared/letterState';
import { Letter } from '../game/game.component';

@Component({
  selector: 'app-letter',
  imports: [],
  templateUrl: './letter.component.html',
  styleUrl: './letter.component.css'
})
export class LetterComponent implements OnInit {
  @Input() letter?: Letter;
  @Input() state: LetterState = LetterState.Unchecked;
  @Input() active: boolean = false;
  
  ngOnInit(): void {
    
  }
}
