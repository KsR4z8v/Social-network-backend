export default interface Like<T> {
  id: T;
  user: {
    id: string;
    username: string;
    avatar: string;
    relationExternalId: string | null;
    requestSentExternalId: string | null;
    requestReceivedExternalId: string | null;
  };
  createdAt: Date;
}
