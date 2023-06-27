import { User } from './user';
export class CandidateParams {
  district: string;
  gramPanchayat: string;
  pageNumber = 1;
  pageSize = 4;
  constructor(user: User) {
    this.district = user.district;
    this.gramPanchayat = user.gramPanchayat;
  }
}
