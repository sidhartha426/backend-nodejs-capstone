import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AppContext';

import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('bearer-token');
    const { setIsLoggedIn } = useAppContext();

    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app')
        }
    }, [navigate])

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        //api call
        const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': bearerToken ? `Bearer ${bearerToken}` : '', // Include Bearer token if available
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        });

        const json = await res.json();
        console.log('Json', json);
        if (json.authtoken) {
            sessionStorage.setItem('auth-token', json.authtoken);
            sessionStorage.setItem('name', json.userName);
            sessionStorage.setItem('email', json.userEmail);
            sessionStorage.setItem('surname',json.surName);
            navigate('/app');
            setIsLoggedIn(true);
        } else {
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            setIncorrect(json.error);
            setTimeout(() => {
                setIncorrect("");
            }, 2000);
        }
        setLoading(false);

    }


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="text"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setIncorrect("") }}
                            />
                            {incorrect === "User not found" &&
                            <span style={{ color: 'red', height: '.5cm', display: 'block', fontStyle: 'italic', fontSize: '12px' }}>{incorrect}</span>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setIncorrect("") }}
                            />
                            {incorrect === "Wrong pasword" &&
                            <span style={{ color: 'red', height: '.5cm', display: 'block', fontStyle: 'italic', fontSize: '12px' }}>{incorrect}</span>}
                        </div>
                        <button disabled={loading} className="btn btn-primary w-100 mb-3" onClick={handleLogin}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Logging In...
                                </>
                            ) : (
                                'Login'
                            )}

                        </button>
                        <p className="mt-4 text-center">
                            New here? <Link to="/app/register" className="text-primary">Register Here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
