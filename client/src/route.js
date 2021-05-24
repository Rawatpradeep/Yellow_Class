import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ApolloProvider from "./apolloProvider";
import SignIn from "../src/Components/SignIn";
import HomePage from "../src/Components/HomePage";
import { AuthProvider } from './context/auth'
import { MessageProvider } from './context/message'

export default class Global extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ApolloProvider>
        <AuthProvider>
          <MessageProvider>
            <BrowserRouter>
              <Switch>
                <Route path={"/sign-in"} component={SignIn} />
                <Route path={"/messages"} component={HomePage} />
                <Route path={"/"} component={SignIn} />
              </Switch>
            </BrowserRouter>
          </MessageProvider>
        </AuthProvider>
      </ApolloProvider>
    );
  }
}
