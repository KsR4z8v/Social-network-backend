export default interface Comment<T> {
  id: T;
  post: T;
  text: String;
  user: {
    id: string;
    username: string;
    urlAvatar: string;
  };
  edited: boolean;
  createdAt: Date;
}
