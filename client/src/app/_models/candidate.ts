import { Photo } from './photo';

export interface Candidate {
  id: number;
  candidateName: string;
  photoUrl: string;
  partyName: string;
  district: string;
  gramPanchayat: string;
  photos: Photo[];
}
