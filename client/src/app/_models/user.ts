export interface User {
  username: string;
  token: string;
  voterIdNumber: string;
  photoUrl: string;
  district: string;
  gramPanchayat: string;
  gender: string;
  hasVoted: boolean;
  roles: string[];
}
