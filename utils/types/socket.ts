import {NewNotificationState,DisplayMessage} from "./index"
export type usersType = {userId:string, socketId:string}[]

// on
export interface ServerToClientEvents {
    "connectedUsers":({users}:{users:usersType})=>void
    "receivedMessage":(args:{newMsg:DisplayMessage})=>Promise<void>
    "likePostNotify":({name, profilePicUrl, username, postId, postPic}:NewNotificationState)=>void
    
}
// emit
export interface ClientToServerEvents {
    "join":({userId: string})=>void
    "leave":()=>void

}