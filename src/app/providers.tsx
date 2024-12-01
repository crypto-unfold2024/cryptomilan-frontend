'use client'
import Navbar from '@/components/navbar';
import { createNetworkConfig, SuiClientProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ComponentPropsWithRef } from 'react';


const Providers: React.FC<ComponentPropsWithRef<'div'>> = ({ children, ...props }) => {

    const { networkConfig } = createNetworkConfig({
        devnet: { url: getFullnodeUrl("devnet") },
    });

    const queryClient = new QueryClient();



    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} network="devnet">
                <WalletProvider {...props}>
                    <Navbar />
                    {children}
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    )
}

export default Providers