interface Media {
  url: string;
  id_kit: string;
  format: string;
}

export default interface PostInterface<T> {
  author: unknown;
  text: string;
  config: {
    archived: boolean;
    private: boolean;
    comments_disabled: boolean;
  };
  doc_deleted: boolean;
  media: Media[];
  countLikes: number;
  countComments: number;
  likes: Array<{
    user: T;
    createdAt: Date;
  }>;
  comments: {
    user: T;
    createdAt: Date;
    edited: boolean;
    likes: Array<{
      user: T;
      createdAt: Date;
    }>;
    text: string;
  };
  createdAt: Date;
}
