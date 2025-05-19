import { Component, Input, OnInit } from '@angular/core';
import { LetterState } from '../../shared/letterState';

@Component({
  selector: 'app-letter',
  imports: [],
  templateUrl: './letter.component.html',
  styleUrl: './letter.component.css'
})
export class LetterComponent implements OnInit {
  @Input() letter?: string;
  @Input() state: LetterState = LetterState.Unchecked;
  
  ngOnInit(): void {
    
  }
}
