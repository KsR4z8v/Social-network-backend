export default interface Like<T> {
  id: T;
  toObject: T;
  user: {
    id: string;
    username: string;
    urlAvatar: string;
  };
  createdAt: Date;
}
