// types/user.ts
export type UserPayload = {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
};

export type ProjectData = {
   title: string; 
   description: string | null 
  };