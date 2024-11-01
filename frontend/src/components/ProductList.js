import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, onDelete, isOwnListings, trackInteraction}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
                <ProductCard
                    key={product._id}
                    product={product}
                    onDelete={onDelete}
                    isOwnListings={isOwnListings}  // Pass this prop to ProductCard
                    trackInteraction={trackInteraction}
                />
            ))}
        </div>
    );
};

export default ProductList;
