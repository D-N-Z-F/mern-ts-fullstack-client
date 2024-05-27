export interface UserI {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  gender: string;
  image: string;
  joinedAt: Date;
  isVerified: boolean;
  isPremium: boolean;
  isAdmin: boolean;
}

export interface RegisterUserI {
  user: UserI;
  upload: File | null;
}

export interface UpdateUserI {
  updatedUser: UserI;
  upload: File | null;
}
