import moment from "moment";


function formatMessage(username: string, text: string) {
    return {
        username,
        text,
        time: moment().format('h:m a')
    }
}

export default formatMessage;