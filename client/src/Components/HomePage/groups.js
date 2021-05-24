import React from "react";
import { gql, useQuery } from '@apollo/client';

import { useMessageDispatch, useMessageState } from '../../context/message';
import { useAuthDispatch, useAuthState } from "../../context/auth";

const GET_GROUPS = gql`
  query getGroups {
    getUserGroups {
      _id,
      name,
      userIds
    }
  }
`


export default function Group(props) {

  const authDispatch = useAuthDispatch()
  const dispatch = useMessageDispatch()
  const { user } = useAuthState()
  const { groups } = useMessageState()
  const { setGroupId } = props
  const { loading } = useQuery(GET_GROUPS, {
    onCompleted: (data) =>
      dispatch({ type: 'SET_GROUPS', payload: data.getUserGroups }),
    onError: (err) => console.log(err),
  })

  const { user: { name } = {} } = user;

  const logout = () => {
    authDispatch({ type: 'LOGOUT' })
    window.location.href = '/'
  }

  let groupsMarkup
  if (!groups || loading) {
    groupsMarkup = <p>Loading..</p>
  } else {
    groupsMarkup = groups.map(group => {
      const { _id, name = "" } = group;
      return <div key={_id} style={{ margin: 10, padding: 8, backgroundColor: "silver" }} onClick={e => setGroupId(_id)}>
        {name}
      </div>
    })
  }

  return <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ marginLeft: 10, fontWeight: "bold", color: "black" }}> {name}</div>

      <div style={{ marginRight: 10, padding: 8, fontWeight: "medium", color: "black", border: "1px silver solid" }} onClick={e => logout()}> LogOut</div>
    </div>
    {groupsMarkup}
  </div>
}