'use client';
import Navbar from '@/components/navbar';
import { createNetworkConfig, SuiClientProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BuildType, OktoProvider } from 'okto-sdk-react';
import React, { ComponentPropsWithRef } from 'react';

const Providers: React.FC<ComponentPropsWithRef<'div'>> = ({
    children,
    ...props
}) => {
    const { networkConfig } = createNetworkConfig({
        devnet: { url: getFullnodeUrl('devnet') },
    });

    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <GoogleOAuthProvider
                clientId={
                    '201737013329-1vammkv48a66k8ijo8fq6p1e34veqe0g.apps.googleusercontent.com'
                }
            >
                <OktoProvider
                    apiKey={'0601c20e-0298-4fbf-97cb-d62508d253c8'}
                    buildType={BuildType.SANDBOX}
                >
                    <SuiClientProvider
                        networks={networkConfig}
                        network="devnet"
                    >
                        <WalletProvider {...props}>{children}</WalletProvider>
                    </SuiClientProvider>
                </OktoProvider>
            </GoogleOAuthProvider>
        </QueryClientProvider>
    );
};

export default Providers;
