import { Photo } from './photo';
export interface User {
  username: string;
  token: string;
  voterIdNumber: string;
  photoUrl: string;
  documentUrl: string;
  district: string;
  gramPanchayat: string;
  gender: string;
  hasVoted: boolean;
  loginAllowed: boolean;
  roles: string[];
  documents: Photo[];
}
