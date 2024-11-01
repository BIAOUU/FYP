import { useState, useEffect } from 'react';

export const useProducts = (searchQuery = {}, page = 1, limit = 10) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);  // Track total number of pages
  const [currentPage, setCurrentPage] = useState(page);  // Track current page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = new URLSearchParams();
        
        if (searchQuery.search) query.append('search', searchQuery.search);
        if (searchQuery.sort) query.append('sort', searchQuery.sort);
        query.append('page', currentPage);
        query.append('limit', limit);

        const response = await fetch(`/api/products?${query.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong while fetching products.');
        }

        setProducts(data.products);
        setTotalPages(data.totalPages);  // Update total pages
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, [searchQuery, currentPage, limit]);

  return { products, error, totalPages, currentPage, setCurrentPage };
};
