import { createContext, useContext, useState } from 'react';

const context = createContext();

export const useLoading = () => useContext(context);

export const LoadingContext = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const startLoading = () => setIsLoading(true);
    const stopLoading = () => setIsLoading(false);

    return (
        <context.Provider value={{ isLoading, startLoading, stopLoading }}>
            {children}
        </context.Provider>
    );
};
