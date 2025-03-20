// src/context/UserContext.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useUser } from "@clerk/clerk-react";

interface IUserContext {
    user: any | null;
}

const UserContext = createContext<IUserContext>({ user: null });

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { user, isLoaded } = useUser();
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        if (isLoaded && user) {
            setUserData(user);
        }
    }, [isLoaded, user]);

    return (
        <UserContext.Provider value={{ user: userData }}>
            {children}
        </UserContext.Provider>
    );
};
