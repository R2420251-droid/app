import React, { useMemo } from 'react';
import { CartItem, Product } from './data';

interface CartPageProps {
  cart: CartItem[];
  products: Product[];
  onUpdateCartItemQuantity: (productId: number, newQuantity: number) => void;
  onRemoveFromCart: (productId: number) => void;
  onBack: () => void;
  onPlaceOrder: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ cart, products, onUpdateCartItemQuantity, onRemoveFromCart, onBack, onPlaceOrder }) => {

  const cartDetails = useMemo(() => {
    return cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return product ? { ...product, quantity: item.quantity } : null;
    }).filter((item): item is Product & { quantity: number } => item !== null);
  }, [cart, products]);

  const totalPrice = useMemo(() => {
    return cartDetails.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartDetails]);

  const handleCheckout = () => {
    const whatsAppNumber = "27670343809";
    let message = "Hello Hair Doc, I would like to place an order for the following items:\n\n";

    cartDetails.forEach(item => {
      message += `*${item.name}*\n`;
      message += `Quantity: ${item.quantity}\n`;
      message += `Price: R${(item.price * item.quantity).toFixed(2)}\n`;
      message += `Image: ${item.imageUrl}\n\n`;
    });

    message += `*Total Price: R${totalPrice.toFixed(2)}*`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;

    window.open(url, '_blank', 'noopener,noreferrer');
    
    onPlaceOrder();
  };

  return (
    <div className="flex h-full flex-col bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 p-4 pb-2 justify-between backdrop-blur-sm">
        <button onClick={onBack} className="flex size-12 shrink-0 items-center justify-start -ml-2" aria-label="Go back to shop">
          <span className="material-symbols-outlined text-text-light dark:text-text-dark">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold tracking-tight text-text-light dark:text-text-dark">My Cart</h1>
        <div className="flex size-12 shrink-0 items-center"></div>
      </header>

      <main className="flex-1 px-4 py-6">
        {cartDetails.length > 0 ? (
          <div className="flex flex-col gap-4">
            {cartDetails.map(item => (
              <div key={item.id} className="flex items-center gap-4 rounded-xl bg-card-light dark:bg-card-dark p-4 shadow-sm">
                <img src={item.imageUrl} alt={item.alt} className="size-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-bold text-text-light dark:text-text-dark">{item.name}</p>
                  <p className="text-sm text-primary">R{item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => onUpdateCartItemQuantity(item.id, item.quantity - 1)} className="flex size-7 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateCartItemQuantity(item.id, item.quantity + 1)} className="flex size-7 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">+</button>
                  </div>
                </div>
                <button onClick={() => onRemoveFromCart(item.id)} className="text-red-500/80" aria-label={`Remove ${item.name} from cart`}>
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-text-muted-light dark:text-text-muted-dark">production_quantity_limits</span>
            <h2 className="mt-4 text-xl font-bold text-text-light dark:text-text-dark">Your Cart is Empty</h2>
            <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">Looks like you haven't added anything to your cart yet.</p>
          </div>
        )}
      </main>

      {cartDetails.length > 0 && (
        <div className="sticky bottom-20 left-0 right-0 z-10 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark">
          <div className="px-4 py-4 space-y-3">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-text-light dark:text-text-dark">Total</span>
              <span className="text-primary">R{totalPrice.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} className="w-full rounded-full bg-primary py-4 px-6 text-center text-base font-bold text-white shadow-lg hover:bg-primary/90">
                Checkout via WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};