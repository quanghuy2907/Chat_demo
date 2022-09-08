import styles from '../styles/Home.module.css'
import { useSocket } from '../context/socket.context'

import RoomsContainer from '../containers/Rooms'
import MessagesContainer from '../containers/Messages'
import { useRef } from 'react'
import EVENTS from '../config/events';

let init: boolean = true

export default function Home() {
  const { socket, username, setUsername, roomList, roomInfo } = useSocket()
  const usernameRef = useRef(null)
  const newRoomNameRef = useRef(null)
  const roomNameRef = useRef(null)

  if (init) {
    socket.emit(EVENTS.CLIENT.REQUEST_ROOM)
    init = false
  }

  function handleCreateRoom() {
    const usernameValue = usernameRef.current.value
    if (!String(usernameValue).trim()) {
      window.alert(`Please enter username`)
      return
    }

    const newRoomName = newRoomNameRef.current.value
    if (!String(newRoomName).trim()) {
      window.alert(`Please enter a roomname`)
      return
    }

    for (let key in roomList) {
      if (roomList[key] === newRoomName) {
        window.alert(`Room ${newRoomName} already exists!`)
        newRoomNameRef.current.value = ''
        return
      }
    }

    setUsername(usernameValue);

    // emit create room event
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { newRoomName, usernameValue });
  }

  function handleJoinRoom() {
    const usernameValue = usernameRef.current.value
    if (!String(usernameValue).trim()) {
      window.alert(`Please enter username`)
      return
    }

    const roomName = roomNameRef.current.value
    if (!String(roomName).trim()) {
      window.alert(`Please enter a roomname`)
      return
    }

    let exist = false
    for (let key in roomList) {
      if (roomName === roomList[key]) {
        exist = true
      }
    }
    if (!exist) {
      window.alert(`Room ${roomName} does not exist!`)
      roomNameRef.current.value = ''
      return
    }
    
 
    setUsername(usernameValue);

    // emit join room event
    socket.emit(EVENTS.CLIENT.JOIN_ROOM, { roomName, usernameValue });
  }

  return (
    <div>
      {!username &&
        <div>
          <div>
            <input placeholder='Username' ref={usernameRef} />
          </div>
          <div>
            <input placeholder='Room name' ref={newRoomNameRef} />
            <button onClick={handleCreateRoom}>CREATE ROOM</button>
          </div>
          <div>
            <input placeholder='Room name' ref={roomNameRef} />
            <button onClick={handleJoinRoom}>JOIN ROOM</button>
          </div>
        </div>}

      {username &&
        <div className={styles.container}>
          <RoomsContainer />
          <MessagesContainer />
        </div>}
    </div>

  );
}
