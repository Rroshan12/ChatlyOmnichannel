export interface GmailAccountSession {
  id: string;
  userId: string;
  email: string;
  name: string;
  isActive: boolean;
  status: number;
  isDeleted: boolean;
}
