import * as React from 'react';

// If using TypeScript, add the following snippet to your file as well.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}

const PricingTable: React.FC = () => {
    return (
        <div className="flex flex-row w-screen h-screen  justify-center">
            <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
            <stripe-pricing-table className="flex flex-row w-screen h-screen" pricing-table-id="prctbl_1QNtdWFAdne61edZwlizcIjY"
                                  publishable-key="pk_test_51QNcvTFAdne61edZBLSGaY7ffIERLp6DG7dwtIJP1mtcDXmrCH6goPMxnNunnJ2obxbjO0J3eIqm2UbGXLfiTZ0p00Mh4RYG7o">
            </stripe-pricing-table>
        </div>
    );
};

export default PricingTable;
