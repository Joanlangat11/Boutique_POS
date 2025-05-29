import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  barcode?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
}

interface ProductContextType {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  updateStock: (id: string, change: number) => void;
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Sample initial products
const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Clothing' },
  { id: '2', name: 'Accessories' },
  { id: '3', name: 'Shoes' },
  { id: '4', name: 'Jewelry' }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Summer Dress',
    description: 'Light and comfortable summer dress',
    price: 49.99,
    stock: 15,
    category: '1',
    barcode: '123456789',
    imageUrl: 'https://images.pexels.com/photos/981619/pexels-photo-981619.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Leather Handbag',
    description: 'Genuine leather handbag',
    price: 79.99,
    stock: 8,
    category: '2',
    barcode: '987654321',
    imageUrl: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Silver Necklace',
    description: 'Sterling silver pendant necklace',
    price: 29.99,
    stock: 20,
    category: '4',
    barcode: '456789123',
    imageUrl: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Ankle Boots',
    description: 'Stylish ankle boots with low heel',
    price: 59.99,
    stock: 12,
    category: '3',
    barcode: '789123456',
    imageUrl: 'https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Load from localStorage or use initial data
    const savedProducts = localStorage.getItem('boutiqueProducts');
    const savedCategories = localStorage.getItem('boutiqueCategories');
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(INITIAL_CATEGORIES);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever products or categories change
    localStorage.setItem('boutiqueProducts', JSON.stringify(products));
    localStorage.setItem('boutiqueCategories', JSON.stringify(categories));
  }, [products, categories]);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newProduct: Product = {
      ...product,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setProducts(products.map(product => 
      product.id === id
        ? { ...product, ...updates, updatedAt: new Date() }
        : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const updateStock = (id: string, change: number) => {
    setProducts(products.map(product => 
      product.id === id
        ? { 
            ...product, 
            stock: Math.max(0, product.stock + change),
            updatedAt: new Date() 
          }
        : product
    ));
  };

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: uuidv4(),
      name
    };
    setCategories([...categories, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  return (
    <ProductContext.Provider 
      value={{
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        updateStock,
        addCategory,
        deleteCategory
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};