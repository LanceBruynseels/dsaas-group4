// pages/pricing.tsx
import React from 'react';
import CreateSubscription from "@components/CreateSubscription";

console.log("paymentPageLoaded")

const PricingPage: React.FC = () => {
    return (
        <div className="flex flex-col justify-between items-center w-screen lg:h-screen h-fit p-4">
            <CreateSubscription />
        </div>
    );
};

export default PricingPage;
