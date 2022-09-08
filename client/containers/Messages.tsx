import { useEffect, useRef } from "react";
import EVENTS from "../config/events";
import { useSocket } from "../context/socket.context";
import styles from '../styles/Message.module.css'

function MessagesContainer() {
    const { socket, messages, roomInfo, username, setMessages } = useSocket()
    const newMessageRef = useRef(null)
    const messageEndRef = useRef(null)

    const temp = username

    function handleSendMessage() {
        const message = newMessageRef.current.value

        if (!String(message).trim()) {
            return
        }

        let roomId = roomInfo.id
        socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, { roomId, message, username })

        const date = new Date()

        setMessages([
            ...messages,
            {
                username: username,
                message,
                time: `${date.getHours()}:${date.getMinutes()}`
            }
        ])

        newMessageRef.current.value = ''

    }

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])


    return (
        < div className={styles.wrapper}>
            < div className={styles.messageList}>
                {messages.map(({ message, username, time }, index) => {
                    return (
                        <div>
                            {username === temp &&
                                <div key={index} className={styles.selfMessage}>
                                    <div key={index} className={styles.messageInner}>
                                        <span className={styles.messageSender}>{username} - {time}</span>
                                        <span className={styles.messageBody}>{message}</span>
                                    </div>
                                </div>
                            }
                            {username === 'Chat bot' &&
                                <div key={index} className={styles.botMessage}>
                                    <div key={index} className={styles.messageInner}>
                                        <span className={styles.messageSender}>- {time} -</span>
                                        <span className={styles.messageBody}>{message}</span>
                                    </div>
                                </div>
                            }
                            {username !== temp && username !== 'Chat bot' &&
                                <div key={index} className={styles.message}>
                                    <div key={index} className={styles.messageInner}>
                                        <span className={styles.messageSender}>{username} - {time}</span>
                                        <span className={styles.messageBody}>{message}</span>
                                    </div>
                                </div>
                            }
                        </div>
                    )
                })}
                <div ref={messageEndRef} />
            </div>

            <div className={styles.messageBox}>

                <textarea
                    rows={1}
                    placeholder='Type your message here'
                    ref={newMessageRef}
                />
                <button onClick={handleSendMessage}>SEND</button>

            </div>
        </div >


    )
}

export default MessagesContainer;