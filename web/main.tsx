import {createRoot} from 'react-dom/client';
import Home from '../app/page';
import {analytics} from '../app/analytics';
import '../app/globals.css';
analytics.initialize();
createRoot(document.getElementById('root')!).render(<Home/>);
