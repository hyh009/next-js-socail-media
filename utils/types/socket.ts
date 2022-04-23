import {NewNotificationState,IMessage} from "./index"
export type usersType = {userId:string, socketId:string}[]

// on
export interface ServerToClientEvents {
    "connectedUsers":(args:{users:usersType})=>void
    "likePostNotify":({name, profilePicUrl, username, postId, postPic}:NewNotificationState)=>void
    "likedPost":({ success, error }:{success:boolean, error:string})=>void
    "messagesLoaded":(args:{chat:IMessage[]})=>void
    "saveMessage":(args:{newMsg:IMessage})=>Promise<void>
    "receivedMessage":(args:{newMsg:IMessage})=>Promise<void>
    "updateMessageDelete":(args:{messagesWith:string,msgId:string,isLastMsg:boolean})=>Promise<void>
    "deletedMessageResult":({ success, error, isLastMsg }:{success:boolean,error:string,isLastMsg:boolean})=>void    
}
// emit
export interface ClientToServerEvents {
    "join":(args:{userId:string})=>void
    "leave":()=>void
    "likePost":(args:{postId:string, userId:string, like:boolean})=>void
    "getMessages":(args:{userId:string,messagesWith:string})=>void
    "sendMessage":({ userId,messagesWith,msg}:{userId:string,messagesWith:string,msg:string})=>void
    "deleteMessage":({userId,messagesWith,msgId}:{userId: string, messagesWith:string, msgId:string,})=>void
}