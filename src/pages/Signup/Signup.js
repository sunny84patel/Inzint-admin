import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Signup.css';
import { auth, db } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const SignUp = () => {
    const SignUpWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
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
                    await setDoc(ref, newUser, { merge: true });
                    console.log('User signed up successfully');
                } catch (err) {
                    console.log(err);
                }
            }).catch((error) => {
                console.log(error.message);
            });
    };

    const handleEmailSignUp = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user;
            console.log(user);
            const newUser = {
                email: user.email,
                signInMethod: 'Email',
                emailVerified: false,
            };
            try {
                const ref = doc(db, 'Users', user.uid);
                await setDoc(ref, newUser, { merge: true });
                console.log('User signed up successfully');
            } catch (err) {
                console.log(err);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className='d-flex align-items-center main-height'>
            <Container className="signup-card bg-white px-0">
                <Row className='gx-0'>
                    <Col md={6}>
                        <div className='bg-white signup-left-card p-4'>
                            <img src={"https://inzint.com/wp-content/uploads/2024/05/inzint-logo-dark-1.png"} alt="Inzint Logo" height="60" />

                            <Row className='my-5 justify-content-center'>
                                <Col md={9} lg={9}>
                                    <h1 className='text-center'>Create an Account</h1>
                                    <p className="text-center">Sign up with your Google account or create a new account.</p>
                                    <Button onClick={SignUpWithGoogle} variant="outline-dark" className='w-100 d-flex justify-content-center align-items-center my-4'>
                                        <img src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png" height="25" alt="Google logo" />
                                        <span className='ms-2'>Sign Up with Google</span>
                                    </Button>

                                    <div className='divider'>
                                        <div className='line'></div>
                                        <div className='text'>Or</div>
                                    </div>
                                    <Form className='mt-5' onSubmit={handleEmailSignUp}>
                                        <Form.Control name='email' type='email' placeholder='Email Address' className="mb-4" required></Form.Control>
                                        <Form.Control name='password' type='password' placeholder='Password' className="mb-4" required></Form.Control>
                                        <Button type='submit' variant="dark" className='w-100'>Sign Up</Button>
                                    </Form>
                                </Col>
                            </Row>

                            <div className='mt-4'>
                                <p className='text-center text-secondary'>Already have an account? <Link to="/login" className='text-dark'>Log In</Link></p>
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className='signup-right-card p-4'></div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default SignUp;
