import { createContext, useContext, useState, useEffect } from 'react';

const StockContext = createContext(null);

export default function ContextProvider(props) {
    const [Context, setContext] = useState({
        UserName: localStorage.getItem('username') || null,
    });

    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access'));
    const [loadingContext, setLoadingContext] = useState(true);

    useEffect(() => {
        const access = localStorage.getItem('access');

        if (!access) {
            setIsLoggedIn(false);
            setLoadingContext(false);
        }
    }, []);

    return (
        <StockContext.Provider value={{ Context, setContext, isLoggedIn, setIsLoggedIn, loadingContext }}>
            {props.children}
        </StockContext.Provider>
    );
}

export const useStockContext = () => useContext(StockContext);
