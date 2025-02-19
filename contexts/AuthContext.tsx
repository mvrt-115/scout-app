import React, {
    useContext,
    useState,
    useEffect,
    createContext,
    FC,
} from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signOut, User, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';

interface ValueData {
    currentUser: User | null | undefined;
    login: (email: string, password: string) => any;
    logout: () => void;
    loggedIn: boolean;
}

const initValue: ValueData = {
    currentUser: undefined,
    login: (email: string, password: string) => {},
    logout: () => {},
    loggedIn: false,
};

const AuthContext = createContext(initValue);

const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>();
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    const signup = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    useEffect(() => setLoggedIn(!!currentUser), [currentUser]);

    const value = {
        currentUser,
        login,
        signup,
        logout,
        loggedIn,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};


export { AuthProvider, useAuth };
