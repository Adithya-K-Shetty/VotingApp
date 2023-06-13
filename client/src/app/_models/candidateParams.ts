import { User } from './user';
export class CandidateParams {
  district: string;
  gramPanchayat: string;
  constructor(user: User) {
    this.district = user.district;
    this.gramPanchayat = user.gramPanchayat;
  }
}
