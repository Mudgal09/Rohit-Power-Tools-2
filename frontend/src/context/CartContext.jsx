import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Load cart from localStorage only when user logs in
  useEffect(() => {
    if (user) {
      try {
        const saved = JSON.parse(localStorage.getItem(`rpt_cart_${user._id}`)) || [];
        setCart(saved);
      } catch { setCart([]); }
    } else {
      setCart([]); // Clear cart when logged out
    }
  }, [user]);

  // Save cart to localStorage keyed by user id
  useEffect(() => {
    if (user) {
      localStorage.setItem(`rpt_cart_${user._id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (product, quantity = 1) => {
    if (!user) { toast.error('Please login to add items to cart'); return; }
    setCart(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) {
        toast.success('Quantity updated!');
        return prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      toast.success('Added to cart! 🛒');
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i._id !== id));
    toast.success('Removed from cart');
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    setCart(prev => prev.map(i => i._id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
