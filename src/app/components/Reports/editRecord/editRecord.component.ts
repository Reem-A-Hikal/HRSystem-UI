import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-editRecord',
  imports: [RouterLink],
  templateUrl: './editRecord.component.html',
  styleUrls: ['./editRecord.component.css']
})
export class EditRecordComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
