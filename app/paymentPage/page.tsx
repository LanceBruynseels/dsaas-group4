// pages/pricing.tsx
import React from 'react';
import CreateSubscription from "@components/CreateSubscription";

console.log("paymentPageLoaded")

const PricingPage: React.FC = () => {
    return (
        <div className="flex flex-col justify-between items-center w-screen h-screen p-16">
            <h1 className="text-center text-6xl font-bold  ">Choose Your Plan</h1>
            <CreateSubscription />
        </div>
    );
};

export default PricingPage;
