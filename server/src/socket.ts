import { Server, Socket } from 'socket.io'
import log from './utils/logger'
import { nanoid } from 'nanoid';
import { userJoin, userLeave, getRoomUsers } from '../utils/users';
import formatMessage from '../utils/messages'


const EVENTS = {
    connection: 'connection',
    disconnect: 'disconnect',
    CLIENT: {
        REQUEST_ROOM: "REQUEST_ROOM",
        CREATE_ROOM: "CREATE_ROOM",
        SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
        JOIN_ROOM: 'JOIN_ROOM'
    },
    SERVER: {
        ROOMS: 'ROOMS',
        JOINED_ROOM: 'JOINED_ROOM',
        ROOM_MESSAGE: 'ROOM_MESSAGE',
        USER_DISCONNECT: "USER_DISCONNECT"
    }
}



let rooms: Record<string, { name: string, id: string, userList: any[], messageList: { message: string, time: string, username: string }[] }> = {}
const roomList: string[] = [];

function socket({ io }: { io: Server }) {
    log.info(`Socket enabled`);
    io.on(EVENTS.connection, (socket: Socket) => {
        log.info(`user connected ${socket.id}`)

        socket.on(EVENTS.CLIENT.REQUEST_ROOM, () => {
            socket.emit(EVENTS.SERVER.ROOMS, roomList)
        })

        /*
        User create a new room
        */
        socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ newRoomName, usernameValue }) => {

            console.log({ newRoomName })
            //create a roomId 
            const roomId = nanoid()
            //add the first user to the room's user list
            const user = userJoin(socket.id, usernameValue, roomId);
            //add a new room to the rooms object
            roomList.push(newRoomName);
            console.log(roomList)

            rooms[roomId] = {
                name: newRoomName,
                id: roomId,
                userList: getRoomUsers(roomId),
                messageList: [],
            }

            socket.join(roomId)
            //emit event to all user that a room is create
            io.emit(EVENTS.SERVER.ROOMS, roomList)
            //emit event back to the room creator saying they have joint a room
            const room = rooms[roomId]
            socket.emit(EVENTS.SERVER.JOINED_ROOM, room)

            const date = new Date();
            socket.emit(EVENTS.SERVER.ROOM_MESSAGE, {
                message: `Welcome to the chat`,
                username: 'Chat bot',
                time: `${date.getHours()}:${date.getMinutes()}`
            })

        })

        /*
         User joins a room
        */
        socket.on(EVENTS.CLIENT.JOIN_ROOM, ({ roomName, usernameValue }) => {
            const date = new Date();

            let roomId: string = ''
            for (let key in rooms) {
                if (rooms[key].name === roomName) {
                    roomId = key
                }
            }

            //add user to the userlist
            const user = userJoin(socket.id, usernameValue, roomId);
            rooms[roomId].userList = getRoomUsers(roomId)
            //join a room 
            socket.join(roomId)
            //emit event back to the user saying they have joint a room
            const room: { name: string, userList: any[], messageList: { message: string, time: string, username: string }[] } = rooms[roomId]
            socket.emit(EVENTS.SERVER.JOINED_ROOM, room)
            socket.broadcast.to(roomId).emit(EVENTS.SERVER.JOINED_ROOM, room)

            socket.broadcast.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
                message: `User ${user.username} joined the chat`,
                username: 'Chat bot',
                time: `${date.getHours()}:${date.getMinutes()}`
            })

            socket.emit(EVENTS.SERVER.ROOM_MESSAGE, {
                message: `Welcome to the chat`,
                username: 'Chat bot',
                time: `${date.getHours()}:${date.getMinutes()}`
            })
        })

        /*
       User sends a message
       */
        socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, ({ roomId, message, username }) => {

            const date = new Date();
            let time = `${date.getHours()}:${date.getMinutes()}`
            let newMessage = { message, username, time }

            rooms[roomId].messageList.push(newMessage)

            socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
                message,
                username,
                time: `${date.getHours()}:${date.getMinutes()}`
            })



        });

        /*
    User disconnect
    */
        socket.on(EVENTS.disconnect, () => {
            const user = userLeave(socket.id);
            const roomId: string = user.room

            log.info(`user disconnected ${user.id}`)
            const date = new Date();

            if (roomId !== '') {
                //remove user from user list
                rooms[roomId].userList = getRoomUsers(roomId)
                const room: { name: string, userList: any[], messageList: { message: string, time: string, username: string }[] } = rooms[roomId]
                // Send users and room info
                io.to(roomId).emit(EVENTS.SERVER.USER_DISCONNECT, room);

                io.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
                    message: `User ${user.username} left the chat`,
                    username: 'Chat bot',
                    time: `${date.getHours()}:${date.getMinutes()}`
                })
            };

        })


    });


};

export default socket