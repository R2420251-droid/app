import React, { useState, useMemo } from 'react';
import { Product, CartItem } from './data';

interface ShopPageProps {
  navigateToHome: () => void;
  products: Product[];
  cart: CartItem[];
  onAddToCart: (productId: number) => void;
  navigateToCart: () => void;
}

const categories = ["All", "Hair Care", "Tools", "Kits", "Skin Care"];

const ShopTopAppBar: React.FC<{ onBack: () => void; onCartClick: () => void; cartItemCount: number }> = ({ onBack, onCartClick, cartItemCount }) => (
    <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
        <button onClick={onBack} className="text-text-light-primary dark:text-text-dark-primary flex size-12 shrink-0 items-center -ml-2" aria-label="Go back">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h2 className="text-text-light-primary dark:text-text-dark-primary text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Shop</h2>
        <div className="flex w-12 items-center justify-end">
            <button onClick={onCartClick} className="relative flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 text-text-light-primary dark:text-text-dark-primary" aria-label="Shopping bag">
                <span className="material-symbols-outlined text-2xl">shopping_bag</span>
                {cartItemCount > 0 && (
                    <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">{cartItemCount}</div>
                )}
            </button>
        </div>
    </header>
);

const ProductCard: React.FC<{ product: Product; onAddToCart: () => void; style?: React.CSSProperties }> = ({ product, onAddToCart, style }) => (
    <div style={style} className="flex flex-col gap-2 animate-fade-in-up">
        <div className="relative w-full">
            <div 
                className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl" 
                style={{ backgroundImage: `url("${product.imageUrl}")` }}
                role="img"
                aria-label={product.alt}
            ></div>
            <button onClick={onAddToCart} className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/80 backdrop-blur-sm text-white transition-transform duration-200 hover:scale-110" aria-label="Add to cart">
                <span className="material-symbols-outlined">add_shopping_cart</span>
            </button>
        </div>
        <div>
            <p className="text-text-light-primary dark:text-text-dark-primary text-base font-bold leading-normal">{product.name}</p>
            <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal leading-normal truncate">{product.description}</p>
            <p className="text-text-light-primary dark:text-text-dark-primary text-sm font-medium leading-normal mt-1">R{product.price.toFixed(2)}</p>
        </div>
    </div>
);


export const ShopPage: React.FC<ShopPageProps> = ({ navigateToHome, products, cart, onAddToCart, navigateToCart }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const filteredProducts = useMemo(() => {
        return products
            .filter(product => activeFilter === 'All' || product.category === activeFilter)
            .filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [searchQuery, activeFilter, products]);
    
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <ShopTopAppBar onBack={navigateToHome} onCartClick={navigateToCart} cartItemCount={cartItemCount} />
            <div className="px-4 py-3">
                <label className="flex flex-col min-w-40 h-12 w-full">
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-surface-light dark:bg-surface-dark">
                        <div className="text-text-light-secondary dark:text-text-dark-secondary flex items-center justify-center pl-4">
                            <span className="material-symbols-outlined text-2xl">search</span>
                        </div>
                        <input 
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-text-light-primary dark:text-text-dark-primary focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-text-light-secondary placeholder:dark:text-text-dark-secondary px-4 pl-2 text-base font-normal leading-normal" 
                            placeholder="Search products..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </label>
            </div>
            <div className="flex gap-3 px-4 py-1 overflow-x-auto">
                <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface-light dark:bg-surface-dark px-4">
                    <span className="material-symbols-outlined text-base text-text-light-primary dark:text-text-dark-primary">tune</span>
                    <p className="text-text-light-primary dark:text-text-dark-primary text-sm font-medium leading-normal">Filters</p>
                </button>
                {categories.map(category => (
                    <button 
                        key={category}
                        onClick={() => setActiveFilter(category)}
                        className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 text-sm font-medium ${
                            activeFilter === category 
                                ? 'bg-primary text-white' 
                                : 'bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary'
                        }`}>
                        <p>{category}</p>
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-4 p-4">
                {filteredProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={() => onAddToCart(product.id)} 
                      style={{ animationDelay: `${index * 100}ms` }}
                    />
                ))}
            </div>
        </div>
    );
};