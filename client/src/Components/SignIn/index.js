import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { gql, useLazyQuery } from '@apollo/client';
import { useAuthDispatch } from '../../context/auth'


const SIGN_IN = gql`
query signIn($user_name: String! $password: String!) {
  signIn(user_name: $user_name password: $password) {
    accessToken,
    user{
      _id
      name
    }
  }
}
`;


const Login = (props) => {
  const [user_name, setUsername] = useState();
  const [password, setPassword] = useState();
  const [signInError, setSignInError] = useState();

  const dispatch = useAuthDispatch()

  const [login, { loading }] = useLazyQuery(SIGN_IN, {
    onError(err) {
      const { graphQLErrors = [] } = err || {}
      const error = graphQLErrors[0].extensions.errors || "";
      setSignInError(error)
    },
    onCompleted(data) {
      dispatch({ type: 'LOGIN', payload: data.signIn });
      props.history.push('/messages');
    }
  });



  const handleSubmit = async (e) => {
    e.preventDefault();
    login({ variables: { user_name, password } })
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Please Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>username</p>
          <input type="text" onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {signInError && (
          <p style={{ color: "red", margin: 8 }}>{signInError}</p>
        )}
        <div style={{ marginTop: 16 }}>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div >
  );
};

const LoginPage = (props) => {
  return <Login {...props} />;
};

export default withRouter(LoginPage);
