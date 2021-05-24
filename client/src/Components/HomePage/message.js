import React, { useEffect, useState } from "react";
import { isEqual } from "lodash"
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useAuthState } from "../../context/auth";
import { useMessageDispatch, useMessageState } from '../../context/message';

const GET_MESSAGES = gql`
  query getMessages($groupId: String!) {
    getGroupMessage(groupId: $groupId) {
        _id
        from {
            _id, name
        }
        groupId,
        content
    }
  }
`


const SEND_MESSAGE = gql`
  mutation addMessage($groupId: String!, $content: String!) {
    addMessage(groupId: $groupId, content: $content) {
      _id
      groupId
      from {
            _id, name
        }
      content
    }
  }
`


export default function Message(props) {

    const [content, setContent] = useState('')
    const dispatch = useMessageDispatch()
    const { user } = useAuthState()
    const { groups = [] } = useMessageState()
    const { groupId } = props
    const groupIndex = groups ? groups.findIndex((u) => u._id === groupId) : null
    let messages = [];
    let groupName
    if (groupIndex && groups[groupIndex]) {
        messages = groups[groupIndex].messages
        groupName = groups[groupIndex].name
    }
    const [
        getMessages,
        { loading: messagesLoading, data: messagesData },
    ] = useLazyQuery(GET_MESSAGES)

    useEffect(() => {
        if (groupId && !messages) {
            getMessages({ variables: { groupId } })
        }
    }, [groupId])

    useEffect(() => {
        if (messagesData) {
            dispatch({ type: 'SET_GROUP_MESSAGES', payload: { groupId, messages: messagesData.getGroupMessage } })
        }
    }, [messagesData])

    const [addMessage] = useMutation(SEND_MESSAGE, {
        onError: (err) => console.log(err),
    })


    console.log('user----------- :>> ', user, messages);

    let messagesMarkup
    if (!groupId) {
        messagesMarkup = <p>Select a group</p>
    }
    else if (!messages || messagesLoading) {
        messagesMarkup = <p>Loading..</p>
    } else {
        messagesMarkup = messages.map(message => {
            const { content = "", from: { _id: fromId, name } = {} } = message;
            const { user: { _id } = {} } = user;
            let alignment = false
            if (isEqual(_id, fromId)) {
                alignment = true
            }
            return <div style={{ width: "100%", textAlign: alignment ? "right" : "left" }}>

                <div style={{ margin: 10, padding: 8, backgroundColor: "silver", }}>
                    {!alignment && < div style={{ color: "white" }}>
                        {name}
                    </div>
                    }
                    {content}
                </div>
            </div >
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        addMessage({ variables: { groupId: groupId, content } })
    }

    return <div >
        {groupId && <div style={{ backgroundColor: "black", color: "white", fontWeight: "bold" }}>
            {groupName}
        </div>}
        <div style={{ display: "flex", flexDirection: "column-reverse" }}>{messagesMarkup}</div>
        {groupId && <div >
            <form onSubmit={handleSubmit}>
                <input type="text" onChange={(e) => setContent(e.target.value)} />
                <div style={{ marginTop: 16 }}>
                    <button type="submit">Send</button>
                </div>
            </form>
        </div >}

    </div>
}