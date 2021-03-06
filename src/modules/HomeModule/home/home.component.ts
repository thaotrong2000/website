import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ArticleService } from 'src/services/ArticleService/article.service';

import { StoreService } from 'src/core/services/store.service';
import { HomeService } from 'src/services/HomeService/home.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/services/LoginService/login.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('mainScreen') elementView: ElementRef = new ElementRef('demo');
  @ViewChild('someVar') el: ElementRef = new ElementRef('demo1');
  @ViewChild('demo') elDemo: ElementRef = new ElementRef('demo2');

  viewHeight: number = 0;

  tags: Array<any> = [];

  articlesArray: any = [];

  limit: number = 10;

  offset: number = 0;

  array: any = [];

  Articles: Array<any> = [];

  paginationArticle: any = [];

  checkLogin: boolean = false;

  checkStatusFeed: any = false;

  checkTabActive: number = 0;

  checkClickNew: boolean = false;

  checkContent: number = 1;

  userNameCurrent: string = '';

  checkClickTag: boolean = false;

  checkCreatedSuccess: boolean = false;

  listTagSearch: Array<string> = [];

  checkTagCurrent: boolean = false;

  displaySelectedTag: boolean = false;
  dataSeletectag: string = '';

  checkTag: BehaviorSubject<any> = new BehaviorSubject(false);
  tagSelected: BehaviorSubject<string> = new BehaviorSubject('');

  articlesBehavior: Subject<any> = new Subject();

  constructor(
    private readonly articleService: ArticleService,
    private storeService: StoreService,
    private homeService: HomeService,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.checkStatusLogin();
    this.getListTags();

    this.tagSelected.subscribe((data) => {
      if (data) {
        console.log('Ban co 1 thong bao ' + data);
        this.displaySelectedTag = true;
        this.checkClickTag = true;
        this.dataSeletectag = data;

        this.Articles = [];
        this.articleService
          .getArticleByTag(this.dataSeletectag)
          .subscribe((data) => {
            this.Articles = data.articles;
            console.log(data);
          });
      } else {
        this.displaySelectedTag = false;
      }
    });

    this.loginService.getCurrenUser().subscribe((data) => {
      this.userNameCurrent = data.user.username;
    });

    this.checkTag.subscribe((data) => {});

    this.storeService.getTokenCurrent().subscribe((data) => {
      if (data) {
        this.checkLogin = true;
      } else {
        this.checkLogin = false;
      }
    });

    if (this.checkLogin) {
      this.whenStatusFeed();
    } else {
      this.whenStatusGlobal();
    }

    this.storeService.setUrlCurrent(this.router.url);

    this.storeService.getUrlCurrent().subscribe((data) => {
      if (data == '/') {
        this.checkClickNew = false;
      } else {
        this.checkClickNew = true;
      }

      this.getListTags();
      if (!this.checkStatusFeed) {
        this.whenStatusGlobal();
      }
    });

    // Fix conflict follow:
    this.articlesBehavior.subscribe((data) => {
      console.log('kiem tra su thay doi cua du lieu');
      console.log(data);
      this.Articles.map((article) => {
        if (article.author.username == data.user) {
          article.author.following = data.statusFollow;
          console.log('thay doi thanh cong');
        }
      });
    });
  }

  /**
   * S??? d???ng Scroll trong Angular
   * Created by: THAONT119
   * */
  ngAfterViewInit(): void {
    this?.el?.nativeElement.addEventListener('scroll', () => {
      this.onScroll();
    });
  }

  /**
   * Khi ch???n tr???ng th??i l?? Global
   * Created by: THAONT119
   * */
  public whenStatusGlobal(): void {
    this.checkTag.next(false);
    this.displaySelectedTag = false;
    // T??? ?????ng l???y 10 b??i vi???t Global khi ch??a Login
    this.Articles = [];
    this.articleService
      .getArticleLimitAndOffset(this.limit, this.offset)
      .subscribe((articles) => {
        this.Articles = articles.articles;
        console.log(this.Articles);
      });

    this.checkStatusFeed = false;
  }

  /**
   * Khi tr???ng th??i l?? Feed
   * Created by: THAONT119
   * */
  public whenStatusFeed(): void {
    this.displaySelectedTag = false;
    this.limit = 10;
    this.offset = 0;
    this.checkTag.next(false);
    this.Articles = [];
    this.checkStatusFeed = true;
    // L???y b??i vi???t c???a nh???ng ng?????i ??ang theo d??i
    this.getFeedArticles();
  }

  /**
   * L???y to??n b??? b??i vi???t - c???a nh???ng ng?????i m??nh ??ang follow
   * Created by: THAONT119
   * */
  public getFeedArticles(): void {
    this.articleService
      .getArticleFeedByLimitAndOffset(this.limit, this.offset)
      .subscribe((data) => {
        console.log(data);
        this.Articles = data.articles;
      });
  }

  /**
   * X??? l?? s??? ki???n: Load th??m d??? li???u khi k??o ?????n cu???i trang
   * Created by: THAONT119 && GIANGNT67
   * */
  public onScroll() {
    // C???ng th??m 56 - v?? 56 l?? chi???u cao c??? ?????nh c???a Navbar
    if (
      window.innerHeight ==
      this.elDemo.nativeElement.getBoundingClientRect().top
    ) {
      // M???i khi k??o xu???ng v??? tr??? BOTTOM(cu???i c??ng c???a trang web)
      // S??? g???i th??m d??? li???u ????? ????a v??o trang web
      this.offset += 10;

      if (this.checkStatusFeed == false && this.checkClickTag == false) {
        this.articleService
          .getArticleLimitAndOffset(this.limit, this.offset)
          .subscribe((articles) => {
            // N???u c?? d??? li???u tr??? v??? - th?? add n?? v??o Articles
            // ????? c???p nh???t cho ng?????i d??ng
            if (articles.articles?.length) {
              console.log(articles.articles);
              for (const article of articles.articles) {
                this.Articles.push(article);
              }
            }
          });
      }
      if (this.checkStatusFeed == true && this.checkClickTag == false) {
        this.articleService
          .getArticleFeedByLimitAndOffset(this.limit, this.offset)
          .subscribe((articles) => {
            // N???u c?? d??? li???u tr??? v??? - th?? add n?? v??o Articles
            // ????? c???p nh???t cho ng?????i d??ng
            if (articles.articles?.length) {
              console.log(articles.articles);
              for (const article of articles.articles) {
                this.Articles.push(article);
              }
            }
          });
      }
    }
  }

  /**
   * Ki???m tra tr???ng th??i Login
   * checkLogin: True - ???? login, False - ch??a login
   * Created by: THAONT119
   * */
  public checkStatusLogin(): void {
    if (this.storeService.getToken()) {
      this.checkLogin = true;
    } else {
      this.checkLogin = false;
    }
  }

  /**
   * L???y to??n b??? Tags
   * Created by: THAONT119
   * */
  public getListTags(): void {
    this.homeService.getTags().subscribe((data) => {
      this.tags = data.tags;
    });
  }

  /**
   * Khi click v??o New Article
   * Created by: THAONT119
   *
   **/
  public checkDemo($event: any): void {
    this.checkClickNew = $event;
  }

  /**
   * Xem chi ti???t m???t b??i vi???t
   * Created by: THAONT119
   * */
  public seeDetails($event: any): void {
    console.log($event);
    this.checkClickNew = true;
  }

  /**
   * Khi click v??o m???t Tags b???t k??, s??? l???y d??? li???u v?? x??? l?? m???t s??? bi???n
   * Created by: THAONT119
   * */
  public clickTag(tagName: string): void {
    // this.homeService.getArtilceByTag(tagName).subscribe((data) => {
    //   console.log(data);

    //   // N???u tr?????c ???? ???? c?? tag ???????c ch???n, th?? ta s??? add th??m v??o d??? li???u Articles s???n c??:
    //   if (this.checkClickTag) {
    //     for (const article of data.articles) {
    //       this.Articles.unshift(article);
    //     }

    //     // N???u tr?????c ???? ch??a c?? s???n d??? li???u, ta s??? t???o m???i m???ng Articles
    //   } else {
    //     this.Articles = data.articles;
    //   }

    //   // Bi???n ?????m b???o r???ng c?? m???t th??? Tags ??ang ???????c ch???n
    //   this.checkClickTag = true;
    // });

    if (this.listTagSearch.indexOf(tagName) < 0) {
      this.listTagSearch.push(tagName);
    } else {
      this.listTagSearch.splice(this.listTagSearch.indexOf(tagName), 1);
    }
    console.log(this.listTagSearch);

    this.Articles = [];
    if (this.listTagSearch.length == 0) {
      this.whenStatusGlobal();
      this.checkClickTag = false;
    }

    for (const tag of this.listTagSearch) {
      this.homeService.getArtilceByTag(tag).subscribe((data) => {
        console.log(data);
        // N???u tr?????c ???? ???? c?? tag ???????c ch???n, th?? ta s??? add th??m v??o d??? li???u Articles s???n c??:
        for (const article of data.articles) {
          this.Articles.unshift(article);
        }
        // Bi???n ?????m b???o r???ng c?? m???t th??? Tags ??ang ???????c ch???n
        this.checkClickTag = true;
      });
    }
  }
}
