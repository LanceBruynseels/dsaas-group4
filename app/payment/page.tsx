// pages/pricing.tsx
import React from 'react';
import PricingTable from 'components/PricingTable';  // Adjust the import path if needed

const PricingPage: React.FC = () => {
    return (
        <div className="flex flex-col justify-content align-center w-screen h-screen">
            <h1 className="text-center text-6xl font-bold mb-6">Choose Your Plan</h1>
            <PricingTable />
        </div>
    );
};

export default PricingPage;
