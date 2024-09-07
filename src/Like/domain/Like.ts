export default interface Like<T> {
  id: T;
  to: T;
  user: {
    id: string;
    username: string;
    urlAvatar: string;
  };
  createdAt: Date;
}
