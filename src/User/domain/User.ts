import type Image from "../../Default/domain/Image";

export default class User<T> {
  constructor(
    readonly id: T,
    readonly username: string,
    readonly email: string,
    readonly bio: string,
    readonly avatar: Image,
    readonly checkVerified: boolean,
    readonly emailVerified: boolean,
    readonly state: boolean,
    readonly fullname: string,
    readonly dateBorn: Date,
    readonly phoneNumber: string,
    readonly countPosts: number,
    readonly countFriends: number,
    readonly profileView: boolean,
    readonly receiveRequests: boolean,
    readonly createdAt: Date,
    readonly updateAt: Date,
    readonly myFriend?: { relationId: T } | null,
    readonly requestSent?: { requestId: T } | null,
    readonly requestReceived?: { requestId: T } | null,
  ) {}
}
