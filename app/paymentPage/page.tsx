// pages/pricing.tsx
import React from 'react';
import CreateSubscription from "@components/CreateSubscription";

const PricingPage: React.FC = () => {
    return (
        <div className="flex flex-col justify-start items-center w-screen h-screen gap-8 p-16">
            <h1 className="text-center text-6xl font-bold mb-6">Choose Your Plan</h1>
            <CreateSubscription />
        </div>
    );
};

export default PricingPage;
