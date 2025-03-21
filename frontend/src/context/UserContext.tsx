// src/context/UserContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface IUserContext {
    user: any | null;
    setUser: (user: any) => void;
}

const UserContext = createContext<IUserContext>({
    user: null,
    setUser: () => { },
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUserState(JSON.parse(storedUser));
        }
    }, []);

    const setUser = (user: any) => {
        setUserState(user);
        console.log(user)
        localStorage.setItem("user", JSON.stringify({ username: user.username, email: user.email }));
    };

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
