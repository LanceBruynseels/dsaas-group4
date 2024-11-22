// pages/pricing.tsx
import React from 'react';
import PricingTable from 'components/PricingTable';  // Adjust the import path if needed

const PricingPage: React.FC = () => {
    return (
        <div className="container mx-auto py-10 w-screen h-screen">
            <h1 className="text-center text-3xl font-bold mb-6">Choose Your Plan</h1>
            <PricingTable />  {/* This will render the PricingTable component */}
        </div>
    );
};

export default PricingPage;
