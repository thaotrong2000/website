import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  baseUrl = 'http://localhost:3000/api';

  articlesList: any = {};

  constructor(private readonly http: HttpClient) {}

  //List Article Service

  getListArticles(): Observable<any> {
    return this.http.get(this.baseUrl + '/articles');
  }

  getArticleByAuthor(authorname: any): Observable<any> {
    return this.http.get(this.baseUrl + `/articles?author=${authorname}`);
  }

  getArticleByTag(tag: any): Observable<any> {
    return this.http.get(this.baseUrl + `/articles?tag=${tag}`);
  }

  getArticleFavoriteByUsername(username: any): Observable<any> {
    return this.http.get(this.baseUrl + `/articles?favorited=${username}`);
  }

  getArticleLimitAndOffset(limit: number, offset: number): Observable<any> {
    return this.http.get(
      this.baseUrl + `/articles?limit=${limit}&&offset=${offset}`
    );
  }

  //Article Feed Service

  getArticleFeed(): Observable<any> {
    return this.http.get(this.baseUrl + '/articles/feed');
  }

  getArticleFeedByLimitAndOffset(
    limit: number,
    offset: number
  ): Observable<any> {
    return this.http.get(
      this.baseUrl + `/articles/feed?limit=${limit}&&offset=${offset}`
    );
  }

  getArticleBySlug(article: any): Observable<any> {
    return this.http.get(this.baseUrl + `/articles/${article}`);
  }

  createArticle(article: any): Observable<any> {
    return this.http.post(this.baseUrl + '/articles', article);
  }

  updateArticle(articlesLug: any, article: any): Observable<any> {
    return this.http.put(this.baseUrl + `/articles/${articlesLug}`, article);
  }

  deleteArticle(slug: any): Observable<any> {
    return this.http.delete(this.baseUrl + `/articles/${slug}`);
  }

  favoriteArticle(slug: any): Observable<any> {
    return this.http.post(this.baseUrl + `/articles/${slug}/favorite`, {});
  }

  unfavoriteArticle(slug: any): Observable<any> {
    return this.http.delete(this.baseUrl + `/articles/${slug}/favorite`, {});
  }
}
