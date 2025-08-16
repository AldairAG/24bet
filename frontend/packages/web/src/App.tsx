import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/routers';
import { ToastContainer } from 'react-toastify';
import  store from 'shared/src/store/store';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="toast-container"
      />
    </Provider>
  );
}

export default App;
