import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import root from './router/root';
import { loadUserFromCookies } from './utils/cookieUtils';
import { setUser } from './store/userSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = loadUserFromCookies();
    if (savedUser) {
      dispatch(setUser(savedUser));
    }
  }, []);

  return <RouterProvider router={root} />;
}

export default App;
