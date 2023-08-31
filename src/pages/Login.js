import React, { useState } from "react";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { MDBContainer, MDBInput, MDBBtn, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBIcon } from "mdb-react-ui-kit";
import { auth, provider } from "../firebase-config";

export function Login({ setAuth }) {
    let navigate = useNavigate();
    const [loginError, setLoginError] = useState(null);
    const [registrationError, setRegistrationError] = useState(null);
    const [isSignIn, setIsSignIn] = useState(true);


    const toggleForm = () => {
        setIsSignIn(!isSignIn);
    };

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider).then((result) => {
            localStorage.setItem("isAuth", true);
            setAuth(true);
            navigate("/");
        });
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
        <MDBContainer fluid>
            <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                <MDBCol col='12'>
                    <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1.5rem', maxWidth: '800px' }}>
                        <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
                            <h2 className="fw-bold mb-2 text-uppercase">{isSignIn ? 'Sign In' : 'Sign Up'}</h2>
                            <p className="text-white-50 mb-5">{isSignIn ? 'Please enter your login and password' : 'Enter your desired username, email and password'}</p>
                            {isSignIn ? (
                                <form onSubmit={handleEmailLogin} className='w-100'>
                                    <MDBInput wrapperClass='mb-4  w-100' labelClass='text-white' label='Email address' id='email' type='email' size="lg" />
                                    <MDBInput wrapperClass='mb-4  w-100' labelClass='text-white' label='Password' id='password' type='password' size="lg" />
                                    <div className="text-center"> <MDBBtn outline className='px-5' color='white' size='lg' type="submit">
                                        Sign In
                                    </MDBBtn> </div>
                                    <div className='text-center mt-2 mb-3'>
                                        <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }} onClick={signInWithGoogle}>
                                            <MDBIcon fab icon='google' size="lg" />
                                        </MDBBtn>
                                    </div>
                                    <p className="text-center mt-3">
                                        Don't have an account? <a href="#!" className="text-white-50 fw-bold" onClick={toggleForm}>Sign Up</a>
                                    </p>
                                    {loginError && <p className="text-danger text-center mt-3">{loginError}</p>}
                                </form>
                            ) : (
                                <form onSubmit={handleEmailRegister} className='w-100'>
                                    <MDBInput wrapperClass='mb-4 w-100' labelClass='text-white' label='Username' id='username' name='regUsername' type='text' size="lg" />
                                    <MDBInput wrapperClass='mb-4 w-100' labelClass='text-white' label='Email address' id='email' name='regEmail' type='email' size="lg" />
                                    <MDBInput wrapperClass='mb-4 w-100' labelClass='text-white' label='Password' id='password' name='regPassword' type='password' size="lg" />
                                    <div className="text-center">
                                        <MDBBtn outline className='px-5' color='white' size='lg' type="submit">
                                            Sign Up
                                        </MDBBtn>
                                    </div>
                                    <div className='text-center mt-2 mb-3'>
                                        <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }} onClick={signInWithGoogle}>
                                            <MDBIcon fab icon='google' size="lg" />
                                        </MDBBtn>
                                    </div>
                                    <p className="text-center mt-3">
                                        Already have an account? <a href="#!" className="text-white-50 fw-bold" onClick={toggleForm}>Sign In</a>
                                    </p>
                                    {registrationError && <p className="text-danger text-center mt-3">{registrationError}</p>}
                                </form>

                            )}
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default Login;