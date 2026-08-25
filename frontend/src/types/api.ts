
export type ProfileType = {
  name: string;
  email: string;
}

export type PasswordUpdate = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type GetProfileResponse = {
  success: boolean;
  message?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UpdateProfileResponse {
  success: boolean;
  message?: string;
  updatedUser: {
    name: string;
    email: string;
  };
}

export interface LoginResponse {
  message?: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
