import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/core/services/store.service';
import { ProfileService } from 'src/services/ProfileService/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {

  public username: any;

  public checkMyArticleTab: boolean = true;

  myListArticles = [
    {
      article: {
        title: "How to train your dragon",
        description: "Ever wonder how?",
        body: "You have to believe",
        tagList: ["reactjs", "angular", "dragons"]
      }
    },
    {
      article: {
        title: "How to train your dragon",
        description: "Ever wonder how?",
        body: "You have to believe",
        tagList: ["reactjs", "angular", "dragons"]
      }
    },
    {
      article: {
        title: "How to train your dragon",
        description: "Ever wonder how?",
        body: "You have to believe",
        tagList: ["reactjs", "angular", "dragons"]
      }
    },
  ];

  profile = {
      profile: {
        username: "jake",
        bio: "I work at statefarm",
        image: "https://static.productionready.io/images/smiley-cyrus.jpg",
        following: false
      }
  }


  constructor(private storeService: StoreService, private readonly profileService: ProfileService,
    private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.storeService.getToken()) {
      console.log(
        '%cBạn đã đăng nhập - bạn ĐƯỢC PHÉP sử dụng Profile',
        'background: red; color: white'
      );

      this.activatedRoute.params.subscribe(username => {
        this.username = username;
      })
    } else {
      console.log(
        '%cBạn chưa đăng nhập - bạn KHÔNG được sử dụng ở Profile',
        'background: red; color: white'
      );
    }
  }

  getProfile(){
    this.profileService.getProfileByUser(this.username);
  }
}
