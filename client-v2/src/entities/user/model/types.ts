export type UserRole = "administrator" | "manualRecorder" | "stopwatchRecorder";

export type User = {
  id: string;
  name: string;
  roles: UserRole[];
  createdAt: Date;
};

export type UserCreateForm = {
  name: string;
  username: string;
  password: string;
};

export type UserRolesForm = {
  roles: UserRole[];
};

export interface UserStore {
  users: User[];
  init: (users: User[]) => void;
  add: (user: User) => void;
  update: (user: User) => void;
  remove: (userId: string) => void;
  clearAll: () => void;
}
