import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ConfigService {

  configUrl = 'assets/config.json';

  constructor(private http: HttpClient) {

  }

  getConfig(): Observable<any> {
    return this.http.get(this.configUrl);
  }
}
