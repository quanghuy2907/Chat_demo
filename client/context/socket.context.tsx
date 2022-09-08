import { createContext, useContext, useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import { SOCKET_URL } from '../config/default'
import EVENTS from '../config/events';

interface Context {
    socket: Socket;
    username?: string
    setUsername: Function
    roomList: string[]
    roomInfo?: {
        name: string,
        id: string,
        userList: {
            id: string;
            username: string;
            room: string;
        }[],
        messageList: { message: string, time: string, username: string }[]
    }
    messages?: { message: string, time: string, username: string }[]
    setMessages: Function
}

const socket = io(SOCKET_URL)

const SocketContext = createContext<Context>({
    socket,
    setUsername: () => false,
    roomList: [],
    messages: [],
    setMessages: () => false,
})

function SocketProvider(props: any) {
    const [username, setUsername] = useState("")
    const [roomList, setRoomList] = useState([])
    const [roomInfo, setRoomInfo] = useState({ name: '', id: '', userList: [], messageList: [] })
    const [messages, setMessages] = useState([])


    useEffect(() => {
        window.onfocus = function () {
            document.title = 'Chat App'
        }
    }, [])

    socket.on(EVENTS.SERVER.ROOMS, (value) => {
        setRoomList(value)
    })

    socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
        setRoomInfo(value)
        setMessages(value.messageList)

        console.log(value)
    })

    socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({ message, username, time }) => {
        if (!document.hasFocus()) {
            document.title = 'New message...'
        }

        setMessages([
            ...messages,
            {
                message,
                username,
                time
            }
        ])
    })

    socket.on(EVENTS.SERVER.USER_DISCONNECT, (value) => {
        setRoomInfo(value)
    })
    return (
        <SocketContext.Provider value={{ socket, username, setUsername, roomList, roomInfo, messages, setMessages }} {...props} />
    );
}

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;

