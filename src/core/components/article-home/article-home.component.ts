import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ArticleService } from 'src/services/ArticleService/article.service';
import { CommentService } from 'src/services/CommentService/comment.service';
import { ProfileService } from 'src/services/ProfileService/profile.service';

@Component({
  selector: 'app-article-home',
  templateUrl: './article-home.component.html',
  styleUrls: ['./article-home.component.css'],
})
export class ArticleHomeComponent implements OnInit {
  @Input() nameAuthor: string = '';
  @Input() srcImage: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() body: string = '';
  @Input() tag: any = [];
  @Input() checkLike: boolean = false;

  @Input() slug: string = '';
  @Input() checkLogin: boolean = false;
  @Input() userNameCurrent: string = '';
  @Input() following: boolean = false;
  @Input() favorited: boolean = false;
  @Input() tagSelected: BehaviorSubject<string> = new BehaviorSubject('');
  @Input() articlesBehavior: Subject<any> = new Subject<any>();

  @Output() seeDetails: EventEmitter<any> = new EventEmitter();

  showComment: boolean = false;
  onHoverComment: boolean = false;
  valueComment: string = '';
  customBody: string = '';

  commentsArr: any[] = [];
  checkReadLong: boolean = false;
  checkReadMore: boolean = true;

  constructor(
    private readonly cmtService: CommentService,
    private profileService: ProfileService,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.getAllComment();

    if (this.body.length > 50) {
      this.checkReadLong = true;
      this.customBody = this.body.slice(0, 50);
    } else {
      this.checkReadLong = false;
      this.customBody = this.body;
    }
    console.log();
  }

  public whenClickComment(): void {
    this.getAllComment();
  }

  public getAllComment() {
    this.cmtService.getCommentFromArticle(this.slug).subscribe((comments) => {
      this.commentsArr = comments.comments;
      for (const comment in this.commentsArr) {
        this.profileService
          .getProfileByUser(this.commentsArr[comment].author.username)
          .subscribe((data) => {
            this.commentsArr[comment].srcImg = data.profile.image;
          });
      }
    });
  }

  public onEnterComment(event: any): void {
    console.log('slug', this.slug);
    this.cmtService
      .createComment(this.slug, { comment: { body: event.target.value } })
      .subscribe((comments) => {
        console.log('new cmt', comments);
        this.getAllComment();
        this.valueComment = '';
      });
  }

  public clickSeeDeatils() {
    this.seeDetails.emit('Ban da chon che do xem');
  }

  public followUsername(): void {
    if (this.checkLogin) {
      if (this.following) {
        this.profileService
          .unfollowUsername(this.nameAuthor)
          .subscribe((data) => {
            console.log(data);
          });
      } else {
        this.profileService
          .followUsername(this.nameAuthor)
          .subscribe((data) => console.log(data));
      }

      this.following = !this.following;
      this.articlesBehavior.next({
        user: this.nameAuthor,
        statusFollow: this.following,
      });
    }
  }

  public likeArticle(): void {
    if (this.checkLogin) {
      this.favorited = !this.favorited;
      if (this.favorited) {
        this.articleService
          .favoriteArticle(this.slug)
          .subscribe((data) => console.log(data));
      } else {
        this.articleService.unfavoriteArticle(this.slug).subscribe((data) => {
          console.log(data);
        });
      }
    }
  }

  public selectedTag(tag: any): void {
    this.tagSelected.next(tag);
  }
}
