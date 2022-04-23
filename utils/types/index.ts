// import {Types} from "mongoose";
import { Dispatch,SetStateAction } from "react"
// Signup
export interface SignupInputstate {
  name: string
  email: string
  password: string
  bio: string
  facebook: string
  youtube: string
  twitter: string
  instagram: string
}

export type SignupHandler =  (e: React.FormEvent<HTMLFormElement>,
  inputData:SignupInputstate, 
  imagePreview:string,
  setErrorMsg:Dispatch<SetStateAction<string>>, 
  setFormLoading:Dispatch<SetStateAction<boolean>>) => Promise<void>

// Login
export interface LoginInputstate {
  email:string
  password:string
}

export type LoginHandler =  (e:React.FormEvent<HTMLFormElement>, 
  inputData:LoginInputstate, 
  setErrorMsg:Dispatch<SetStateAction<string>>, 
  setFormLoading:Dispatch<SetStateAction<boolean>>)=>Promise<void>

// USER
export interface DisplayUser {
  _id?: string
  name: string
  profilePicUrl: string
}

export interface SearchUser extends DisplayUser {
  username: string
}


export interface IUser extends SearchUser {
  email:string
  role:"user"|"admin"
  newMessagePopup:boolean
  unreadMessage:boolean
  unreadNotification:boolean
}

export interface IUserFollowStats {
  user:string
  following: {user:string, _id:string}[]
  followers: {user:string, _id:string}[]
}
// POST
export interface IPost {
  _id:string
  user:IUser
  text:string
  location?:string
  picUrl?:string
  comments:IComment[]
  likes:{user:string,_id:string}[]
  createdAt:number
}

// COMMENT
type dateType = number|string;

export interface IComment {
  _id:string
  user: IUser
  text: string
  date:dateType
}


// Profile

export interface IProfile {
  _id:string
  user: IUser
  bio: string
  social?: {
      youtube?: string
      facebook?:  string
      twitter?:  string
      instagram?:  string
    }
}

export interface ProfileUpdateState {
  bio: string
  facebook: string
  instagram: string
  youtube: string
  twitter: string
}

export interface PasswordsUpdateState {
  currentPassword: string
  newPassword: string
  confirmPassword: string
} 

// CHAT

export interface CurrentChatWithState {
  messagesWith: string, // mongodb _id
  name: string
  profilePicUrl: string,
}
export interface IChat extends CurrentChatWithState {
  lastMessage?:string
  date?: number
  _id?:string
}

export interface ConnectedUserState {
  userId:string
}

//NOTIFICATION
export interface NotificationState {
  _id:string
  type: "newLike"| "newComment"| "newFollower"
  user: IUser
  date: number|string
  post?: IPost
  commentId?:string
  text?: string
}

export  interface NewNotificationState {
  name:string
  username:string
  profilePicUrl:string
  postId?:string
  postPic?:string
}

// MESSAGE
export interface DisplayMessage {
  _id:string
  msg:string
  date:number
}

export interface IMessage extends DisplayMessage{
  sender:string
  receiver:string
}


export interface NewReceivedMsgState extends IMessage {
  senderProfilePic:string
  senderName:string
}






export type InputTypes = 
    "button" | "checkbox"| "color"| "date"| "datetime-local"| "email"| "file"| "hidden"|
    "image"| "month"|  "number"| "password"| "radio"| "range"| "reset"| "search"| "submit"|
    "tel"| "text"| "time"| "url"| "week"
  

