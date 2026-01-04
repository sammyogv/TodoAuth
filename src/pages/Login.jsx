import { signInWithEmailAndPassword, } from "firebase/auth";
import { useState } from "react";
import { Form, Link, useNavigate, Navigate } from "react-router";
import { auth } from "../utilities/firebase";
import { useAuth } from "../context/authContext.jsx";





export default function Login() {

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const {credentials, loadings} = useAuth();
    

    if (loadings) {
        return <div>Loading...</div>;
    }

    if (credentials) {
        return <Navigate to="/" replace />;
    }
    
    const firebaseErrorMap = {
        "auth/email-already-in-use": "This email is already registered.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            setLoading(false);
            navigate("/", { replace: true });
        } catch (error) {
            
            const message= firebaseErrorMap[error.code] || "An unexpected error occurred. Please try again.";

            setErrorMessage(message);
            setLoading(false)
            return;
        }
    }



    return(
        <div className="w-screen h-screen flex items-center justify-center bg-white flex-col">
            <h1 className="font-poppins font-semibold text-[32px]">Login Page</h1>
            <Form noValidate method="post" onSubmit={handleSubmit} className="lg:w-[60%] md:w-[80%] bg-lightBlue flex flex-col rounded-2xl p-5 gap-5 mt-10 justify-center items-center">
                <div className="flex md:flex-row xs:flex-col w-[80%] text-white gap-4">
                    <label htmlFor="email" className="md:flex-1 text-sm md:text-[15px]">Email</label>
                        <input className="w-full md:flex-1 border-gray 
                        border" 
                    id="email" type="email" value={loginEmail} onChange={(e) => { setLoginEmail(e.target.value); setErrorMessage(''); setEmailError(''); }} />
                    {emailError && <span className="text-red-500 ml-2">{emailError}</span>}
                </div>
                <div className=" flex xs:flex-col md:flex-row w-[80%] text-white gap-4">
                    <label className="md:flex-1 text-sm md:text-[15px]" htmlFor="password">Password</label>
                    <input className="w-full md:flex-1 border-gray 
                    border" 
                    id="password" type="password" value={loginPassword} onChange={(e) => { setLoginPassword(e.target.value); setErrorMessage(''); setPasswordError(''); }} />
                    {passwordError && <span className="text-red-500 ml-2">{passwordError}</span>}
                </div>
                <h2>Don't have an account? <Link to="/Signup" className="text-white underline">SignUp</Link></h2>

                <button type="submit" disabled = {loading} className="bg-white text-lightBlue font-semibold px-6 py-2 rounded-full mt-5">{loading? "Loading..." : "Login"  }</button>
                {errorMessage && <span className="text-red-500 mt-2">{errorMessage}</span>}
            </Form>

        </div>
    )
}


