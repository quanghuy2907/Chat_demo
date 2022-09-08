import { useRef, useEffect } from 'react'
import { useSocket } from "../context/socket.context";
import EVENTS from '../config/events';
import styles from '../styles/Room.module.css'

function RoomsContainer() {
    const { socket, roomInfo } = useSocket()
    const userEndRef = useRef(null)

    let roomInfo_: {
        name: string,
        id: string,
        userList: {
            id: string;
            username: string;
            room: string;
        }[],
        messageList: { message: string, time: string, username: string }[]
    } = roomInfo

    let userList = roomInfo_.userList

    useEffect(() => {
        userEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [userList])

    return (
        <div className={styles.wrapper}>

            <p>ROOM: {roomInfo_.name}</p>
            <div className={styles.userListWrapper}>

                <p>AVAILABLE USERS</p>
                <div className={styles.userList}>
                    {userList.map(({ id, username, room }, index) => {
                        return <div key={index}>
                            <div>{username}</div>
                        </div>
                    })}
                    <div ref={userEndRef} />
                </div>


            </div>

        </div>)
}

export default RoomsContainer;