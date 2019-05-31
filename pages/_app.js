import App from 'next/app';
import React from 'react';
import {Provider} from 'react-redux';
import withRedux from 'next-redux-wrapper';
import {getOrCreateStore} from 'utils/store';
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import compose from 'recompose/compose';
import getPageContext from 'utils/getPageContext';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';
import Notifications from 'components/Notifications';
import NProgress from 'nprogress';
import Navbar from 'components/Navbar';
import Router from 'next/router';
import Sidebar from 'components/Sidebar';
import styles from 'styles/app';
import config from 'config';
import Head from 'next/head'
import SplitPane from "react-split-pane";
import Loading from "components/Loading";

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};
// Inject the insertion-point-jss after docssearch
if (process.browser && !global.__INSERTION_POINT__) {
  global.__INSERTION_POINT__ = true;
  const styleNode = document.createComment('insertion-point-jss');
  const docsearchStylesSheet = document.querySelector('#insertion-point-jss');

  if (document.head && docsearchStylesSheet) {
    document.head.insertBefore(styleNode, docsearchStylesSheet.nextSibling);
  }
}

class MyApp extends App {
  // static childContextTypes: { pages: *, activePage: * };
  //
  // static propTypes: { pageContext: *, router: * };

  constructor(props) {
    super(props);
    this.pageContext = getPageContext();
  }

  state = {
    mobileOpen: false,
    disablePermanent: false,
    open: true,
  };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleDrawerOpen = () => {
    this.setState({ mobileOpen: true, disablePermanent: true });
  };

  handleDrawerClose = () => {
    this.setState({
      mobileOpen: false,
      disablePermanent: false,
    });
  };

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  renderChildren=(Component,pageProps)=>{
    return(
      <MuiThemeProvider
        theme={this.pageContext.theme}
        sheetsManager={this.pageContext.sheetsManager}
      >
        <div style={{ width: '100%', height: '100%' }}>
          <Component pageContext={this.pageContext} {...pageProps} />
        </div>
      </MuiThemeProvider>
    )
  };

  getPathRule=() => {
    return config.router[this.props.router.pathname] || {};
  };

  render() {
    const { Component, pageProps, store } = this.props;
    const pathRule = this.getPathRule();
    return (
      <Provider store={store}>
        <JssProvider
          jss={this.pageContext.jss}
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            <CssBaseline />
            <Notifications />
            <Loading />
            {pathRule.navbar !== false && <Navbar />}
            <Head>
              <title>{config.title}</title>
            </Head>
            <main style={{ height: pathRule.sidebar !== false ? 'calc(100% - 64px)' : '100%', display: 'flex' }}>
              {pathRule.sidebar !== false?
                <SplitPane
                  split="vertical"
                  defaultSize={220}
                  minSize={200}
                  maxSize={300}
                  style={{height:'calc( 100% - 64px )!important'}}
                >
                  <Sidebar/>
                  {this.renderChildren(Component,pageProps)}
                </SplitPane>
                :
                this.renderChildren(Component,pageProps)
              }
            </main>
          </MuiThemeProvider>
        </JssProvider>
      </Provider>
    );
  }
}
export default compose(
  withStyles(styles),
  withRedux(getOrCreateStore),
)(MyApp);
