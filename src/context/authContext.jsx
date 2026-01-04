import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../utilities/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [credentials, setCredentials] = useState(null);
    const [loadings, setLoadings] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCredentials(user);
            setLoadings(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ credentials, loadings }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
