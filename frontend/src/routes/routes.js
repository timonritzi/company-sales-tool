import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Login } from '../components/login/login';
import { PostCell } from '../components/post/post';
import Livechat from "../pages/livechat";
import { MainPage } from '../pages/main';
import { Header } from '../components/header/header';
import { SalesmanPage } from '../pages/salesman';
import LivechatOperator from "../pages/livechatOperator";
import { OperatorPage } from '../pages/operator';
import {LoginPage} from "../pages/loginpage";
import {About} from "../components/about/about";
import {AutoSteinerSalesmanPage} from "../pages/autoSteinersalesman";
import {SellerCardsViewMini} from "../components/sellerCardsView/SellerCardsViewMini";



export const Routes = () => {

    return (

        <Router>
            <Switch>
                <Route exact={true} path="/main/:username" component={MainPage} />
                <Route exact={true} path="/auto-graf/bmw" component={SalesmanPage} />
                <Route exact={true} path="/auto-steiner" component={AutoSteinerSalesmanPage} />
                <Route exact={true} path="/auto-graf/mini" component={SellerCardsViewMini} />
                <Route exact={true} path="/postcell" component={PostCell} />
                <Route exact={true} path="/verkaufsteamlogin" component={LoginPage} />
                <Route exact={true} path="/chat" component={Livechat} />
                <Route exact={true} path="/chat/operator" component={LivechatOperator} />
                <Route exact={true} path="/header" component={Header} />
                <Route exact={true} path="/operator" component={OperatorPage} />
                <Route exact={true} path="/about" component={About} />
            </Switch>
        </Router>

    )
}