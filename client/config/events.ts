
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


export default EVENTS;