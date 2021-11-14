import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StoreService } from 'src/core/services/store.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @Input() checkLogin: boolean = false;
  @Input() newArticle: boolean = false;
  @Output() clickNewArticle: EventEmitter<any> = new EventEmitter();

  checkUrl: string = '';

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.storeService.getUrlCurrent().subscribe((url) => {
      this.checkUrl = url;
    });
  }

  public clickCheckNew(): void {
    this.clickNewArticle.emit(true);
  }
}
