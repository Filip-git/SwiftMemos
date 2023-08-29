import React, { useState } from "react";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { MDBContainer, MDBTabs, MDBTabsItem, MDBTabsLink, MDBTabsContent, MDBTabsPane, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { auth, provider } from "../firebase-config";

export function Login({ setAuth }) {
    let navigate = useNavigate();
    const [justifyActive, setJustifyActive] = useState('tab1');
    const [loginError, setLoginError] = useState(null);
    const [registrationError, setRegistrationError] = useState(null);

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider).then((result) => {
            localStorage.setItem("isAuth", true);
            setAuth(true);
            navigate("/");
        });
    };

    const handleJustifyClick = (value) => {
        if (value === justifyActive) {
            return;
        }
        setJustifyActive(value);
    };

    const handleEmailLogin = async (event) => {
        event.preventDefault();
        const { email, password } = event.target.elements;
        try {
            await signInWithEmailAndPassword(auth, email.value, password.value);
            setAuth(true);
            navigate("/");
        } catch (error) {
            setLoginError(error.message);
        }
    };

    const handleEmailRegister = async (event) => {
        event.preventDefault();
        const { regEmail, regPassword, regUsername } = event.target.elements;

        try {
            await createUserWithEmailAndPassword(auth, regEmail.value, regPassword.value, regUsername.value);
            await updateProfile(auth.currentUser, { displayName: regUsername.value });
            setAuth(true);
            navigate("/");
        } catch (error) {
            setRegistrationError(error.message);
        }
    };

    return (
        <div className="loginPage">
            <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
                <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
                    <MDBTabsItem>
                        <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
                            Login
                        </MDBTabsLink>
                    </MDBTabsItem>
                    <MDBTabsItem>
                        <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
                            Register
                        </MDBTabsLink>
                    </MDBTabsItem>
                </MDBTabs>

                <MDBTabsContent>

                    <MDBTabsPane show={justifyActive === 'tab1'}>
                        <div className="text-center mb-3">
                            <button className="login-with-google-btn" onClick={signInWithGoogle}>
                                Sign in with Google
                            </button>
                            <p className="text-center mt-3">or:</p>
                        </div>

                        {/* Email Login Form */}
                        <form onSubmit={handleEmailLogin}>
                            <MDBInput wrapperClass='mb-4' label='Email address' id='email' htmlFor='email' type='email' />
                            <MDBInput wrapperClass='mb-4' label='Password' id='password' htmlFor='password' type='password' />
                            <div className="text-center">
                                <MDBBtn className="mb-4">Sign in</MDBBtn>
                            </div>
                            {loginError && <p className="error-message">{loginError}</p>}
                        </form>

                    </MDBTabsPane>

                    <MDBTabsPane show={justifyActive === 'tab2'}>
                        <div className="text-center mb-3">
                            <button className="login-with-google-btn" onClick={signInWithGoogle}>
                                Sign in with Google
                            </button>
                            <p className="text-center mt-3">or:</p>
                        </div>

                        {/* Email Registration Form */}
                        <form onSubmit={handleEmailRegister}>
                            <MDBInput wrapperClass='mb-4' label='Username' id='regUsername' type='text' />
                            <MDBInput wrapperClass='mb-4' label='Email address' id='regEmail' htmlFor='email' type='email' />
                            <MDBInput wrapperClass='mb-4' label='Password' id='regPassword' htmlFor='password' type='password' />
                            <div className="text-center">
                                <MDBBtn className="mb-4">Sign up</MDBBtn>
                            </div>
                            {registrationError && <p className="error-message">{registrationError}</p>}
                        </form>
                    </MDBTabsPane>
                </MDBTabsContent>
            </MDBContainer>
        </div>
    );
}

export default Login;