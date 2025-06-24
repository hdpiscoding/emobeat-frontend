import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')!).render(
    <>
        <App />
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{ zIndex: 1000 }}
        />
    </>

)
