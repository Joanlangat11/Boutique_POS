import React, { createContext, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useProduct } from './ProductContext';
import toast from 'react-hot-toast';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'petty-cash';

export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  timestamp: Date;
  cashierId: string;
  cashierName: string;
  change?: number;
  amountReceived?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
  checkout: (paymentMethod: PaymentMethod, amountReceived?: number) => Transaction;
  transactions: Transaction[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { getProductById, updateStock } = useProduct();
  
  const addItem = (productId: string, quantity = 1) => {
    const product = getProductById(productId);
    
    if (!product) {
      toast.error("Product not found");
      return;
    }
    
    if (product.stock < quantity) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }
    
    const existingItemIndex = items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex !== -1) {
      const updatedItems = [...items];
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        toast.error(`Cannot add more. Only ${product.stock} items available`);
        return;
      }
      
      updatedItems[existingItemIndex].quantity = newQuantity;
      setItems(updatedItems);
    } else {
      setItems([
        ...items,
        {
          id: uuidv4(),
          productId,
          name: product.name,
          price: product.price,
          quantity,
        },
      ]);
    }
    
    toast.success(`Added ${product.name} to cart`);
  };
  
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    const item = items.find(item => item.id === id);
    if (!item) return;
    
    const product = getProductById(item.productId);
    if (!product) return;
    
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }
    
    setItems(
      items.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setItems([]);
  };
  
  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const checkout = (paymentMethod: PaymentMethod, amountReceived?: number): Transaction => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      throw new Error("Cannot checkout with empty cart");
    }
    
    const total = calculateTotal();
    
    if (paymentMethod === 'cash' && (!amountReceived || amountReceived < total)) {
      toast.error("Insufficient amount received");
      throw new Error("Insufficient amount received");
    }
    
    // Update stock for each product
    items.forEach(item => {
      updateStock(item.productId, -item.quantity);
    });
    
    const transaction: Transaction = {
      id: uuidv4(),
      items: [...items],
      total,
      paymentMethod,
      timestamp: new Date(),
      cashierId: '1', // This would come from the authenticated user
      cashierName: 'Demo Cashier', // This would come from the authenticated user
    };
    
    if (paymentMethod === 'cash' && amountReceived) {
      transaction.amountReceived = amountReceived;
      transaction.change = amountReceived - total;
    }
    
    setTransactions([...transactions, transaction]);
    clearCart();
    
    toast.success("Sale completed successfully!");
    return transaction;
  };
  
  return (
    <CartContext.Provider 
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        calculateTotal,
        checkout,
        transactions,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};