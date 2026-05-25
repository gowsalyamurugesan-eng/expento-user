import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";
import { LocationProvider } from "@/context/LocationContext";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

const rootElement = document.getElementById('root')

if (!rootElement) {
    throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <UserProvider>
                    <LocationProvider>
                        <CartProvider>
                            <TooltipProvider>
                                <App />
                            </TooltipProvider>
                        </CartProvider>
                    </LocationProvider>
                </UserProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
)
