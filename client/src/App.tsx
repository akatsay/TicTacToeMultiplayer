import './styles/scss/index.scss';
import {BrowserRouter as Router} from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './hooks/auth.hook';
import { useRoutes } from './routes';

import { Footer } from './components/navigation/footer';
import { Header } from './components/navigation/header';
import { AppLoader } from './components/loaders/AppLoader';
import React from 'react';
import {Provider} from 'react-redux';
import store from './redux/store';

function App() {

  return (
    <Provider store={store}>
      <InnerApp />
    </Provider>
  );
}

const InnerApp = () => {

  const {isAuthenticated, ready} = useAuth();
  const routes = useRoutes(isAuthenticated);

  if (!ready) {
    return <AppLoader/>;
  }

  return (
    <Router basename={'/'}>
      <div className="container">
        <Header />
        {routes}
        <Footer />
        <ToastContainer
          limit={3}
          newestOnTop={false}
          rtl={false}
        />
      </div>
    </Router>
  );
};

export default App;
