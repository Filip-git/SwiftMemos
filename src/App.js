import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { CreatePost } from './pages/CreatePost';
import { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase-config';

function App() {

  const [isAuth, setAuth] = useState(localStorage.getItem("isAuth") === "true");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);


  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("isAuth");
      setAuth(false)
    })
  }

  return (
    <Router>
      <nav>
        <div className="left-nav">
          <Link to="/">SwiftMemos {user && <span className="username">{user.displayName}</span>}</Link>
        </div>
        <div className="right-nav">
          <Link to="/">Home</Link>

          {!isAuth ? (<Link to="/login">Login</Link>) : (<><Link to="/createpost">Create Post</Link><Link to="/login" onClick={signUserOut}>Log Out</Link> </>)}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home isAuth={isAuth} />} />
        <Route path="/home" element={<Home isAuth={isAuth} />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/createpost" element={<CreatePost isAuth={isAuth} />} />
      </Routes>
    </Router>
  );
}

export default App;