import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Candidate } from '../_models/candidate';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, take } from 'rxjs';
import { AccountService } from './account.service';
import { CandidateParams } from '../_models/candidateParams';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class CandidatesService {
  baseUrl = environment.apiUrl;
  user: User | undefined;
  candidateParams: CandidateParams | undefined;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          this.candidateParams = new CandidateParams(user);
          this.user = user;
        }
      },
    });
  }

  getCandidateParams() {
    return this.candidateParams;
  }

  setCandidateParams(params: CandidateParams) {
    this.candidateParams = params;
  }

  resetUserParams() {
    if (this.user) {
      this.candidateParams = new CandidateParams(this.user);
      return this.candidateParams;
    }
    return;
  }

  getCandidates(params?: any): Observable<Candidate[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.append(key, params[key]);
      });
    }
    return this.http.get<Candidate[]>(this.baseUrl + 'candidates', {
      params: httpParams,
    });
  }

  getAllCandidates() {
    return this.http.get<Candidate[]>(
      this.baseUrl + 'candidates/get-all-candidates'
    );
  }

  getAllWinners() {
    return this.http.get<Candidate[]>(
      this.baseUrl + 'candidates/get-all-winners'
    );
  }

  casteVote(params: any) {
    return this.http.put(this.baseUrl + 'candidates/cast-vote', params).pipe(
      map(() => {
        this.user!.hasVoted = true;
        localStorage.setItem('user', JSON.stringify(this.user));
      })
    );
  }

  deleteCandidate(params: any) {
    const options = {
      body: params,
    };
    return this.http.delete(
      this.baseUrl + 'candidates/remove-candidate',
      options
    );
  }
}
