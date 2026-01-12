import React, { useState, useMemo, useEffect } from 'react';
import { Product } from './data';

interface AdminProductsPageProps {
    navigateToDashboard: () => void;
    products: Product[];
    onAddProduct: (product: Omit<Product, 'id'>, imageFile: File | null) => void;
    onUpdateProduct: (product: Product, imageFile: File | null) => void;
    onDeleteProduct: (id: number) => void;
}

const ProductModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product | Omit<Product, 'id'>, imageFile: File | null) => void;
  product: Product | null;
}> = ({ isOpen, onClose, onSave, product }) => {

  const initialFormState: Omit<Product, 'id'> = {
    name: '',
    category: 'Hair Care',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    alt: '',
  };

  const [formData, setFormData] = useState<Omit<Product, 'id'>>(initialFormState);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData(product);
        setSelectedImageFile(null); // Clear selected file when editing existing product
      } else {
        setFormData(initialFormState);
        setSelectedImageFile(null);
      }
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumber = ['price', 'stock'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file); // Store the file object

      // For immediate preview, read as DataURL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      onSave({ ...formData, id: product.id }, selectedImageFile);
    } else {
      onSave(formData, selectedImageFile);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg w-full max-w-md max-h-[90vh] flex flex-col animate-scale-in">
        <h3 className="p-4 border-b border-border-light dark:border-border-dark text-lg font-bold text-text-light dark:text-text-dark">{product ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
           <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required />
            <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2">
              <option value="Hair Care">Hair Care</option>
              <option value="Tools">Tools</option>
              <option value="Kits">Kits</option>
              <option value="Skin Care">Skin Care</option>
            </select>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" rows={3}></textarea>
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required />
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required />
            <div className="mt-2 flex items-center gap-x-3">
              {formData.imageUrl ? <img src={formData.imageUrl} alt="Preview" className="h-16 w-16 object-cover rounded-lg" /> : <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>}
              <label htmlFor="file-upload" className="cursor-pointer rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <span>Upload</span>
                <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            <input type="text" name="alt" value={formData.alt} onChange={handleChange} placeholder="Image Alt Text" className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" />
        </form>
        <div className="p-4 flex justify-end gap-2 border-t border-border-light dark:border-border-dark">
            <button onClick={onClose} className="h-9 px-4 rounded-full bg-gray-200 text-text-light text-sm font-medium">Cancel</button>
            <button type="submit" className="h-9 px-4 rounded-full bg-primary text-white text-sm font-medium">Save</button>
        </div>
      </div>
    </div>
  );
};


export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({ navigateToDashboard, products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);

    const handleOpenAddModal = () => {
      setEditingProduct(null);
      setIsModalOpen(true);
    };

    const handleOpenEditModal = (product: Product) => {
      setEditingProduct(product);
      setIsModalOpen(true);
    };

    const handleSave = (productData: Product | Omit<Product, 'id'>) => {
      if ('id' in productData) {
        onUpdateProduct(productData);
      } else {
        onAddProduct(productData);
      }
    };

    const filteredProducts = useMemo(() => {
        return products.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery, products]);

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-background-light/80 dark:bg-background-dark/80 px-4 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
                <button onClick={navigateToDashboard} className="flex size-12 cursor-pointer items-center justify-center -ml-2 text-text-light dark:text-text-dark" aria-label="Back to Dashboard">
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-text-dark">Product Management</h1>
                <div className="h-12 w-12"></div>
            </header>
            
            <div className="px-4 py-3 sticky top-[64px] bg-background-light dark:bg-background-dark z-10">
                <label className="flex flex-col min-w-40 h-12 w-full">
                    <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-primary/10 dark:bg-primary/20">
                        <div className="text-primary/70 dark:text-primary/90 flex items-center justify-center pl-4">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input 
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl border-none bg-transparent h-full placeholder:text-primary/70 dark:placeholder:text-primary/90 px-4 pl-2 text-base font-normal leading-normal text-text-light dark:text-text-dark focus:outline-0 focus:ring-0" 
                            placeholder="Search products" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                        />
                    </div>
                </label>
            </div>
            
            <main className="flex flex-col px-4 pt-2 pb-4 space-y-3">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div key={product.id} className="flex items-center gap-4 bg-card-light dark:bg-card-dark p-2 rounded-xl shadow-sm">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14" style={{ backgroundImage: `url("${product.imageUrl}")` }} role="img" aria-label={product.alt}></div>
                            <div className="flex flex-col justify-center flex-1">
                                <p className="text-base font-medium leading-normal line-clamp-1">{product.name}</p>
                                <p className="text-sm font-normal leading-normal line-clamp-2 text-text-muted-light dark:text-text-muted-dark">R{product.price.toFixed(2)} - {product.stock} in stock</p>
                            </div>
                            <div className="shrink-0 flex items-center gap-2 pr-2">
                                {confirmingDeleteId === product.id ? (
                                    <>
                                      <button onClick={() => { onDeleteProduct(product.id); setConfirmingDeleteId(null); }} className="h-10 px-4 rounded-lg bg-red-500 text-white text-sm font-bold">Confirm</button>
                                      <button onClick={() => setConfirmingDeleteId(null)} className="h-10 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark text-sm font-bold">Cancel</button>
                                    </>
                                ) : (
                                    <>
                                      <button onClick={() => handleOpenEditModal(product)} className="flex size-10 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                                          <span className="material-symbols-outlined text-xl pointer-events-none">edit</span>
                                      </button>
                                      <button onClick={() => setConfirmingDeleteId(product.id)} className="flex size-10 items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors">
                                          <span className="material-symbols-outlined text-xl pointer-events-none">delete</span>
                                      </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <span className="material-symbols-outlined text-4xl">shopping_bag</span>
                        </div>
                        <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">No Products Yet</p>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Get started by adding your first product.</p>
                        <button onClick={handleOpenAddModal} className="mt-4 flex h-10 items-center justify-center gap-x-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary/90">
                            Add First Product
                        </button>
                    </div>
                )}
            </main>
             <div className="fixed bottom-24 right-6 z-20">
                <button onClick={handleOpenAddModal} className="flex items-center justify-center size-14 rounded-full bg-primary text-white shadow-lg" aria-label="Add new product">
                  <span className="material-symbols-outlined !text-3xl">add</span>
                </button>
              </div>
             <ProductModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSave}
              product={editingProduct}
            />
        </div>
    );
};