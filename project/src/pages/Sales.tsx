import React, { useState } from 'react';
import { useProduct } from '../context/ProductContext';
import { useCart, PaymentMethod } from '../context/CartContext';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, DollarSign, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

const Sales: React.FC = () => {
  const { products } = useProduct();
  const { items, addItem, removeItem, updateQuantity, clearCart, calculateTotal, checkout } = useCart();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountReceived, setAmountReceived] = useState<number | ''>('');
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState<any>(null);
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.includes(searchTerm)
  );
  
  const handleCheckout = () => {
    try {
      // Validate cart is not empty
      if (items.length === 0) {
        toast.error("Cannot checkout with empty cart");
        return;
      }
      
      // For cash payments, validate amount received
      if (selectedPaymentMethod === 'cash') {
        if (!amountReceived) {
          toast.error("Please enter amount received");
          return;
        }
        
        const total = calculateTotal();
        if (Number(amountReceived) < total) {
          toast.error("Amount received is less than total");
          return;
        }
      }
      
      const transaction = checkout(
        selectedPaymentMethod, 
        selectedPaymentMethod === 'cash' ? Number(amountReceived) : undefined
      );
      
      setCompletedTransaction(transaction);
      setReceiptVisible(true);
      setShowCheckoutModal(false);
      
      // Reset checkout form
      setSelectedPaymentMethod('cash');
      setAmountReceived('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed");
    }
  };
  
  const handlePrintReceipt = () => {
    // In a real application, this would trigger printing functionality
    toast.success("Printing receipt...");
    // This would normally trigger the print dialog
    // window.print();
  };
  
  const closeReceipt = () => {
    setReceiptVisible(false);
    setCompletedTransaction(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales</h1>
      </div>
      
      <div className="flex flex-1 gap-6 h-full overflow-hidden">
        {/* Products Panel */}
        <div className="w-2/3 flex flex-col">
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products or scan barcode..."
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => addItem(product.id)}
                >
                  <div className="h-40 bg-gray-200">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400 text-2xl">{product.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{product.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="font-bold text-indigo-600">${product.price.toFixed(2)}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.stock <= 5 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.stock} in stock
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No products found
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Cart Panel */}
        <div className="w-1/3 bg-white rounded-lg shadow flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Current Sale</h2>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                  <Trash2 className="h-12 w-12" />
                </div>
                <p className="text-lg font-medium">Cart is empty</p>
                <p className="text-sm mt-2">Add products by clicking on them from the list</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.id} className="py-3 flex justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center border rounded-md">
                        <button 
                          onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                          className="p-1 text-gray-500 hover:text-indigo-600"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-500 hover:text-indigo-600"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="mb-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="font-medium">Tax (0%)</span>
                <span>$0.00</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold">Total</span>
              <span className="text-xl font-bold">${calculateTotal().toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button 
                onClick={() => clearCart()}
                className="py-2 px-4 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear
              </button>
              <button 
                onClick={() => items.length > 0 && setShowCheckoutModal(true)}
                className="py-2 px-4 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:bg-indigo-300"
                disabled={items.length === 0}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Checkout</h2>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Select Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('cash')}
                    className={`flex items-center justify-center p-4 rounded-lg border transition-colors ${
                      selectedPaymentMethod === 'cash'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Banknote className="h-5 w-5 mr-2" />
                    <span>Cash</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('card')}
                    className={`flex items-center justify-center p-4 rounded-lg border transition-colors ${
                      selectedPaymentMethod === 'card'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('mobile')}
                    className={`flex items-center justify-center p-4 rounded-lg border transition-colors ${
                      selectedPaymentMethod === 'mobile'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Smartphone className="h-5 w-5 mr-2" />
                    <span>Mobile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('petty-cash')}
                    className={`flex items-center justify-center p-4 rounded-lg border transition-colors ${
                      selectedPaymentMethod === 'petty-cash'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span>Petty Cash</span>
                  </button>
                </div>
              </div>
              
              {selectedPaymentMethod === 'cash' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Received
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value ? parseFloat(e.target.value) : '')}
                      min={calculateTotal()}
                      step="0.01"
                      className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  {amountReceived !== '' && amountReceived >= calculateTotal() && (
                    <div className="mt-2 text-sm text-gray-600">
                      Change due: ${(amountReceived - calculateTotal()).toFixed(2)}
                    </div>
                  )}
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Total Items:</span>
                  <span>
                    {items.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="bg-white text-gray-700 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Complete Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Receipt Modal */}
      {receiptVisible && completedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Receipt</h2>
              <button 
                onClick={closeReceipt}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center">
                <h3 className="font-bold text-lg">Boutique POS</h3>
                <p className="text-sm text-gray-600">123 Fashion Street</p>
                <p className="text-sm text-gray-600">Email: contact@boutique.com</p>
                <p className="text-sm text-gray-600">Tel: (123) 456-7890</p>
              </div>
              
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Receipt #:</span>
                  <span>{completedTransaction.id.substring(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date(completedTransaction.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cashier:</span>
                  <span>{completedTransaction.cashierName}</span>
                </div>
              </div>
              
              <div className="border-t border-b border-gray-200 py-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-2">Item</th>
                      <th className="pb-2 text-right">Qty</th>
                      <th className="pb-2 text-right">Price</th>
                      <th className="pb-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {completedTransaction.items.map((item: any) => (
                      <tr key={item.id}>
                        <td className="py-2">{item.name}</td>
                        <td className="py-2 text-right">{item.quantity}</td>
                        <td className="py-2 text-right">${item.price.toFixed(2)}</td>
                        <td className="py-2 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div>
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span>${completedTransaction.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tax (0%):</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2">
                  <span>Total:</span>
                  <span>${completedTransaction.total.toFixed(2)}</span>
                </div>
                
                {completedTransaction.paymentMethod === 'cash' && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span>Amount Received:</span>
                      <span>${completedTransaction.amountReceived?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Change:</span>
                      <span>${completedTransaction.change?.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                  <span>Payment Method:</span>
                  <span className="capitalize">{completedTransaction.paymentMethod.replace('-', ' ')}</span>
                </div>
              </div>
              
              <div className="text-center text-gray-600 text-sm">
                <p>Thank you for shopping with us!</p>
              </div>
            </div>
            
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={handlePrintReceipt}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;