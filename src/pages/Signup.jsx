import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Form, Link, useNavigate, Navigate } from "react-router";
import { auth } from "../utilities/firebase.js";
import { useAuth } from "../context/authContext";

export default function Signup() {

    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const navigate = useNavigate();
    const {credentials} = useAuth();

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
                    console.log("Form submitted");

                
                    if (!emailRegex.test(signupEmail)) {
                        setEmailError("Invalid email format");
                        console.log("Invalid email format");
                        return;
                    }
                    if (!passwordRegex.test(signupPassword)) {
                        setPasswordError("Password must be at least 8 characters long and include both letters and numbers");
                        console.log("Weak password");
                        return;
                        
                    }
                    setLoading(true);
                    try {
                        await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
                        navigate("/Login", { replace: true });
                        
                        
                    } catch (error) {

                        const message = firebaseErrorMap[error.code] || "An unexpected error occurred. Please try again.";

                        setErrorMessage(message);
                        setLoading(false);
                        return;
                    }

                }




    return(
        <div className="w-screen h-screen flex items-center justify-center bg-white flex-col">
            <h1 className="font-poppins font-semibold text-[32px]">Signup</h1>
            <Form noValidate method="post"
                onSubmit= {handleSubmit}
                className="md:w-[80%] lg:w-[60%] bg-lightBlue flex flex-col rounded-2xl p-5 gap-5 mt-10 justify-center items-center">
                <div className="flex flex-col w-[80%] text-white">
                    <div className="flex xs:flex-col md:flex-row text-white gap-4">
                        <label className="md:flex-1 text-sm md:text-[15px]">Email</label>
                        <input className="md:flex-1 w-full border-gray 
                        border" 
                         type="email" value={signupEmail} onChange={(e) => { setSignupEmail(e.target.value); setErrorMessage(''); setEmailError(''); }} />
                    </div>
                    {emailError && <span className="text-red-500 ml-2">{emailError}</span>}
                </div>
                <div className="flex flex-col w-[80%] text-white">
                    <div className=" flex xs:flex-col md:flex-row text-white gap-4">
                    
                        <label className="md:flex-1 text-sm md:text-[15px]" >Password</label>
                        <input className="md:flex-1 w-full border-gray 
                        border" 
                        type="password" value={signupPassword} onChange={(e) => { setSignupPassword(e.target.value); setErrorMessage(''); setPasswordError(''); }} />
                    
                    </div>
                    {passwordError && <span className="text-red-500 ml-2">{passwordError}</span>}
                </div>
                <h2>Already have an account? <Link to="/Login" className="text-white underline">Login</Link></h2>

                <button type="submit" disabled={loading} className="bg-white text-lightBlue font-semibold px-6 py-2 rounded-full mt-5">{loading? "Loading..." : "Signup"  }</button>
                {errorMessage && <span className="text-red-500 mt-2">{errorMessage}</span>}
            </Form>

        </div>
    )
}


