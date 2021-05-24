import React, { useState, useEffect } from "react";
import { gql, useSubscription } from '@apollo/client';

import { useMessageDispatch } from '../../context/message'
import { useAuthState } from '../../context/auth'

import Group from "./groups";
import Message from "./message";

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      _id
      from
      groupId
      content
    }
  }
`

export default function HomePage() {
    const [groupId, setGroupId] = useState();
    const { user } = useAuthState()
    const messageDispatch = useMessageDispatch()

    const { data: messageData, error: messageError } = useSubscription(
        NEW_MESSAGE
    )

    useEffect(() => {
        if (messageError) console.log(messageError)
        if (messageData) {
            const message = messageData.newMessage

            messageDispatch({
                type: 'ADD_MESSAGE',
                payload: {
                    groupId: message.groupId,
                    message,
                },
            })
        }
    }, [messageError, messageData])


    if (!user) {
        return <div> Please Sign In First</div>
    }


    return <div style={{ display: "flex", minHeight: "100vh" }}>
        <div style={{ width: "30%", borderRight: "1px silver solid" }}>
            <Group setGroupId={setGroupId} />
        </div>
        <div style={{ flex: 1, margin: 15, paddingTop: 20 }}>
            <Message groupId={groupId} />
        </div>
    </div>
}