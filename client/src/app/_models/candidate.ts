import { Photo } from './photo';

export interface Candidate {
  id: number;
  candidateName: string;
  photoUrl: string;
  partyName: string;
  district: string;
  gramPanchayat: string;
  voteCount: Int16Array;
  photos: Photo[];
}
