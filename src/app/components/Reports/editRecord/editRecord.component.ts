import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/Auth.service';

@Component({
  selector: 'app-editRecord',
  imports: [RouterLink],
  templateUrl: './editRecord.component.html',
  styleUrls: ['./editRecord.component.css']
})
export class EditRecordComponent implements OnInit {

  constructor( public authService: AuthService) { }

  ngOnInit() {
  }

}
