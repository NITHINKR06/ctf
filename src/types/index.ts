// Firebase User types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Challenge interface
export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  flag: string;
  category: string;
  createdAt: Date | string;
}

// User Score interface
export interface UserScore {
  userId: string;
  userName: string;
  totalScore: number;
  solvedChallenges: string[];
}
