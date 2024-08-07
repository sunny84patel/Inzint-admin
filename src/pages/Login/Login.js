import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Login.css';
import { auth, db } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Login = () => {
    const LoginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log(user);
                const newUser = {
                    fullName: user.displayName,
                    email: user.email,
                    mobile: user.phoneNumber,
                    profilePic: user.photoURL,
                    signInMethod: 'Google',
                    emailVerified: true,
                };
                try {
                    const ref = doc(db, 'Users', user.uid);
                    const newData = await setDoc(ref, newUser, { merge: true });
                    console.log(newData);
                } catch (err) {
                    console.log(err);
                }
            }).catch((error) => {
                console.log(error.message);
            });
    };

    return (
        <div className='d-flex align-items-center main-height'>
            <Container className="login-card bg-white px-0">
                <Row className='gx-0'>
                    <Col md={6}>
                        <div className='bg-white login-left-card p-4'>
                            <img src={"https://inzint.com/wp-content/uploads/2024/05/inzint-logo-dark-1.png"} alt="Inzint Logo" height="60" />

                            <Row className='my-5 justify-content-center'>
                                <Col md={9} lg={9}>
                                    <h1 className='text-center'>Welcome Back</h1>
                                    <p className="text-center">Welcome Back! Please enter your credentials to login.</p>
                                    <Button onClick={LoginWithGoogle} variant="outline-dark" className='w-100 d-flex justify-content-center align-items-center my-4'>
                                        <img src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png" height="25" alt="Google logo" />
                                        <span className='ms-2'>Login with Google</span>
                                    </Button>

                                    <div className='divider'>
                                        <div className='line'></div>
                                        <div className='text'>Or</div>
                                    </div>
                                    <Form className='mt-5'>
                                        <Form.Control type='email' placeholder='Email Address' className="mb-4"></Form.Control>
                                        <Form.Control placeholder='Password' type='password' className="mb-2"></Form.Control>
                                        <a href="" className='d-block text-secondary text-end ms-auto mb-4'>Forgot Password?</a>
                                        <Button variant="dark" className='w-100'>Login</Button>
                                    </Form>
                                </Col>
                            </Row>

                            <div className='mt-4'>
                                <p className='text-center text-secondary'>Don't have an account? <Link to="/signup" className='text-dark'>Sign up for free</Link></p>
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className='login-right-card p-4'></div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
