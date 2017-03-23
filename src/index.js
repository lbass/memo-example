import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import { App, Home, Login, Register } from 'containers';

// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from 'reducers';
import thunk from 'redux-thunk';


const store = createStore(reducers, applyMiddleware(thunk));
const rootElement = document.getElementById('root');
const history = createBrowserHistory();

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <div>
            <Route component={App} />
            <Route exact path="/" component={Home}/>
            <Route path="/home" component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            </div>
        </Router>
    </Provider>, rootElement
);
