export default interface UserDataSession {
  userId: string;
  username: string;
  role: string;
  authToken: string;
  restoreToken: string | null;
}
