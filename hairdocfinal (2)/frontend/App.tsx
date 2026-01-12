import React, { useState, useEffect } from 'react';
import { HomePage } from './frontend/HomePage';
import { ServicesPage } from './frontend/ServicesPage';
import { TrainingPage } from './frontend/TrainingPage';
import { AboutUsPage } from './frontend/AboutUsPage';

import { ContactPage } from './frontend/ContactPage';
import { ShopPage } from './frontend/ShopPage';
import { BottomNavBar } from './components/BottomNavBar';
import { SuccessStoriesPage } from './frontend/SuccessStoriesPage';
import { AdminServicesPage } from './frontend/AdminServicesPage';
import { BookPage } from './frontend/BookPage';
import { AdminBookingsPage } from './frontend/AdminBookingsPage';
import { AdminProductsPage } from './frontend/AdminProductsPage';
import { AdminEnrollmentsPage } from './frontend/AdminEnrollmentsPage';
import { AdminGalleryPage } from './frontend/AdminGalleryPage';
import { AdminLoginPage } from './frontend/AdminLoginPage';
import { AdminSettingsPage } from './frontend/AdminSettingsPage';
import { AdminDashboardPage } from './frontend/AdminDashboardPage';
import { AdminOrdersPage } from './frontend/AdminOrdersPage';
import { AdminBottomNavBar } from './AdminBottomNavBar';
import { AdminTrainingPage } from './frontend/AdminTrainingPage';
import { GalleryPage } from './frontend/GalleryPage';
import { ResetPasswordPage } from './frontend/ResetPasswordPage';
import { servicesData, Service, productsData, Product, coursesData, Course, bookingsData, Booking, enrollmentsData, Enrollment, galleryData, GalleryItem, settingsData, Settings, ordersData, Order, OrderStatus, CartItem, User } from './frontend/data';
import { api } from './api';
import { SideMenu } from './components/SideMenu';
import { EnrollmentPage } from './frontend/EnrollmentPage';
import { CartPage } from './frontend/CartPage';
import { Toast } from './components/Toast';
import { ClientLoginPage } from './frontend/ClientLoginPage';
import { ClientSignUpPage } from './frontend/ClientSignUpPage';
import { ClientAccountPage } from './frontend/ClientAccountPage';

// Helper hook for localStorage persistence
function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      if (stickyValue !== null) {
        return JSON.parse(stickyValue);
      }
      window.localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

export type ToastMessage = { message: string; type: 'success' | 'error' };
export type Page = 'home' | 'services' | 'training' | 'about' | 'contact' | 'shop' | 'success-stories' | 'book' | 'gallery' | 'enrollment' | 'cart'
| 'client-login' | 'client-signup' | 'client-account' | 'reset-password'
| 'admin-login' | 'admin-dashboard' | 'admin-services' | 'admin-training' | 'admin-bookings' | 'admin-products' | 'admin-enrollments' | 'admin-gallery' | 'admin-settings' | 'admin-orders';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCourseForEnrollment, setSelectedCourseForEnrollment] = useState<Course | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  
  const [services, setServices] = useStickyState<Service[]>(servicesData, 'hair-doc-services');
  const [products, setProducts] = useStickyState<Product[]>(productsData, 'hair-doc-products');
  const [courses, setCourses] = useStickyState<Course[]>(coursesData, 'hair-doc-courses');
  const [bookings, setBookings] = useStickyState<Booking[]>(bookingsData, 'hair-doc-bookings');
  const [enrollments, setEnrollments] = useStickyState<Enrollment[]>(enrollmentsData, 'hair-doc-enrollments');
  const [galleryItems, setGalleryItems] = useStickyState<GalleryItem[]>(galleryData, 'hair-doc-galleryItems');
  const [settings, setSettings] = useStickyState<Settings>(settingsData, 'hair-doc-settings');
  const [orders, setOrders] = useStickyState<Order[]>(ordersData, 'hair-doc-orders');
  const [cart, setCart] = useStickyState<CartItem[]>([], 'hair-doc-cart');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    let favicon: HTMLLinkElement | null = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = settings.faviconUrl || '';
  }, [settings.faviconUrl]);

  // On mount, attempt to fetch authoritative data from the backend API.
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const serverData = await api.fetchAllData();
        if (!mounted) return;

        if (Array.isArray(serverData.services) && serverData.services.length) setServices(serverData.services as Service[]);
        if (Array.isArray(serverData.products) && serverData.products.length) setProducts(serverData.products as Product[]);
        if (Array.isArray(serverData.courses) && serverData.courses.length) setCourses(serverData.courses as Course[]);
        if (Array.isArray(serverData.bookings) && serverData.bookings.length) setBookings(serverData.bookings as Booking[]);
        if (Array.isArray(serverData.enrollments) && serverData.enrollments.length) setEnrollments(serverData.enrollments as Enrollment[]);
        if (Array.isArray(serverData.gallery) && serverData.gallery.length) setGalleryItems(serverData.gallery as GalleryItem[]);
        if (serverData.settings && Object.keys(serverData.settings).length) setSettings(serverData.settings as Settings);
        if (Array.isArray(serverData.orders) && serverData.orders.length) setOrders(serverData.orders as Order[]);
      } catch (err) {
        console.warn('Could not fetch backend data - continuing with local fallback:', err);
      }
    })();
    return () => { mounted = false; };
  }, []);
  
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name.split(' ')[0]}!`);
    if (user.role === 'Super Admin') {
      navigateTo('admin-dashboard');
    } else {
      navigateTo('client-account');
    }
  };

  const handleSignUp = () => {
    showToast('Account created successfully! Please log in.', 'success');
  };

  const handleLogout = () => {
      api.logout();
      setCurrentUser(null);
      showToast('You have been logged out.');
      navigateTo('home');
  };

  const handleUpdateCurrentUserProfile = (updatedProfile: { name: string; avatarUrl: string; }) => {
      if (currentUser) {
          const updatedUser = { ...currentUser, ...updatedProfile };
          setCurrentUser(updatedUser);
          showToast('Profile updated successfully!', 'success');
      }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await api.forgotPassword(email);
      showToast('If an account with that email exists, a password reset link has been sent.', 'success');
      navigateTo('client-login');
    } catch (err: any) {
      showToast(err.message || 'Error sending password reset email.', 'error');
    }
  };

  const handleAddService = async (newService: Omit<Service, 'id'>) => {
    try {
      const created = await api.post('services', newService) as any;
      setServices(prev => [...prev, created]);
      showToast('Service added!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error adding service.', 'error');
    }
  };

  const handleUpdateService = async (updatedService: Service) => {
    try {
      await api.put(`services/${updatedService.id}`, updatedService);
      setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
      showToast('Service updated!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error updating service.', 'error');
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    try {
      await api.delete(`services/${serviceId}`);
      setServices(prev => prev.filter(s => s.id !== serviceId));
      showToast('Service deleted!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error deleting service.', 'error');
    }
  };

  const handleAddProduct = async (newProductData: Omit<Product, 'id'>, imageFile: File | null) => {
    try {
      let imageUrl = newProductData.imageUrl;
      if (imageFile) {
        const uploadRes = await api.uploadImage(imageFile);
        imageUrl = uploadRes.imageUrl;
      }
      const newProduct = { ...newProductData, imageUrl };
      const created = await api.post('products', newProduct) as any;
      setProducts(prev => [...prev, created]);
      showToast('Product added!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error adding product.', 'error');
    }
  };

  const handleUpdateProduct = async (updatedProductData: Product, imageFile: File | null) => {
    try {
      let imageUrl = updatedProductData.imageUrl;
      if (imageFile) {
        const uploadRes = await api.uploadImage(imageFile);
        imageUrl = uploadRes.imageUrl;
      }
      const updatedProduct = { ...updatedProductData, imageUrl };
      await api.put(`products/${updatedProduct.id}`, updatedProduct);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      showToast('Product updated!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error updating product.', 'error');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await api.delete(`products/${productId}`);
      setProducts(prev => prev.filter(p => p.id !== productId));
      showToast('Product deleted!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error deleting product.', 'error');
    }
  };

  const handleAddCourse = async (newCourse: Omit<Course, 'id'>) => {
    try {
      const created = await api.post('courses', newCourse) as any;
      setCourses(prev => [...prev, created]);
      showToast('Course added!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error adding course.', 'error');
    }
  };

  const handleUpdateCourse = async (updatedCourse: Course) => {
    try {
      await api.put(`courses/${updatedCourse.id}`, updatedCourse);
      setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
      showToast('Course updated!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error updating course.', 'error');
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    try {
      await api.delete(`courses/${courseId}`);
      setCourses(prev => prev.filter(c => c.id !== courseId));
      showToast('Course deleted!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error deleting course.', 'error');
    }
  };
  
  const handleAddEnrollment = async (details: { name: string; email: string; phone: string; avatarUrl?: string; }) => {
    if (!selectedCourseForEnrollment) return;
    const newEnrollment: Omit<Enrollment, 'id'> = {
        name: details.name, email: details.email, phone: details.phone, course: selectedCourseForEnrollment.title,
        submitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Pending',
        avatarUrl: details.avatarUrl || `https://i.pravatar.cc/150?u=${details.name.replace(/\s/g, '')}`,
        alt: `Profile picture of ${details.name}`
    };
    try {
      const created = await api.post('enrollments', newEnrollment) as any;
      setEnrollments(prev => [...prev, created]);
      showToast('Enrollment application submitted!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error submitting enrollment.', 'error');
    }
    navigateTo('training');
  };

  const handleAddBooking = async (newBookingData: Omit<Booking, 'id' | 'status'>) => {
    const newBooking: Omit<Booking, 'id'> = { ...newBookingData, status: 'Pending' };
    try {
      const created = await api.post('bookings', newBooking) as any;
      setBookings(prev => [...prev, created]);
      showToast('Booking submitted successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error submitting booking.', 'error');
    }
  };

  const handleUpdateBooking = async (updatedBooking: Booking) => {
    try {
      await api.put(`bookings/${updatedBooking.id}`, updatedBooking as any);
      setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
      showToast(`Booking ${updatedBooking.status.toLowerCase()}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error updating booking.', 'error');
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    try {
      await api.delete(`bookings/${bookingId}`);
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      showToast('Booking deleted!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error deleting booking.', 'error');
    }
  };

  const handleUpdateEnrollment = async (updatedEnrollment: Enrollment) => {
    try {
      await api.put(`enrollments/${updatedEnrollment.id}`, updatedEnrollment);
      setEnrollments(prev => prev.map(e => e.id === updatedEnrollment.id ? updatedEnrollment : e));
      showToast(`Enrollment ${updatedEnrollment.status.toLowerCase()}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error updating enrollment.', 'error');
    }
  };

  const handleDeleteEnrollment = async (enrollmentId: number) => {
    try {
      await api.delete(`enrollments/${enrollmentId}`);
      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
      showToast('Enrollment deleted!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error deleting enrollment.', 'error');
    }
  };

  const handleDeleteGalleryItem = async (itemId: number) => {
    try {
      await api.delete(`gallery/${itemId}`);
      setGalleryItems(prev => prev.filter(i => i.id !== itemId));
      showToast('Image deleted!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error deleting gallery item.', 'error');
    }
  };

  const handleAddGalleryItem = async (newItemData: Omit<GalleryItem, 'id'>, imageFile: File | null) => {
    try {
      let imageUrl = newItemData.imageUrl;
      if (imageFile) {
        const uploadRes = await api.uploadImage(imageFile);
        imageUrl = uploadRes.imageUrl;
      }
      const newItem = { ...newItemData, imageUrl };
      const created = await api.post('gallery', newItem) as any;
      setGalleryItems(prev => [...prev, created]);
      showToast('Image added!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error adding gallery item.', 'error');
    }
  };

  const handleUpdateGalleryItem = async (updatedItemData: GalleryItem, imageFile: File | null) => {
    try {
      let imageUrl = updatedItemData.imageUrl;
      if (imageFile) {
        const uploadRes = await api.uploadImage(imageFile);
        imageUrl = uploadRes.imageUrl;
      }
      const updatedItem = { ...updatedItemData, imageUrl };
      await api.put(`gallery/${updatedItem.id}`, updatedItem as any);
      setGalleryItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
      showToast('Image updated!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error updating gallery item.', 'error');
    }
  };

  const handleUpdateSettings = async (updatedSettings: Settings) => {
    try {
      await api.put('settings', updatedSettings);
      setSettings(updatedSettings);
      showToast('Settings saved!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error updating settings.', 'error');
    }
  };
  
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await api.put(`orders/${orderId}`, { status });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      showToast('Order status updated!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error updating order status.', 'error');
    }
  };
  
  const handleAddToCart = (productId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === productId);
      if (existingItem) {
        return prevCart.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prevCart, { productId, quantity: 1 }];
      }
    });
    showToast('Item added to cart!', 'success');
  };
  const handleUpdateCartItemQuantity = (productId: number, newQuantity: number) => setCart(prevCart => newQuantity <= 0 ? prevCart.filter(item => item.productId !== productId) : prevCart.map(item => item.productId === productId ? { ...item, quantity: newQuantity } : item));
  const handleRemoveFromCart = (productId: number) => setCart(prevCart => prevCart.filter(item => item.productId !== productId));

  const handlePlaceOrder = async () => {
    if (!currentUser || cart.length === 0) return;
    const cartDetails = cart.map(item => ({ ...products.find(p => p.id === item.productId)!, quantity: item.quantity }));
    const total = cartDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder: Order = {
      id: `#HD-${String(Date.now()).slice(-4)}`,
      clientName: currentUser.name,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending',
      total: total
    };
    try {
      const created = await api.post('orders', newOrder) as any;
      setOrders(prev => [created, ...prev]);
      setCart([]);
      showToast('Order placed successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error placing order.', 'error');
    }
  };

  const navigateTo = (targetPage: Page) => {
    if (targetPage.startsWith('admin-') && targetPage !== 'admin-login' && (!currentUser || currentUser.role !== 'Super Admin')) {
      setPage('client-login');
      return;
    }
    setPage(targetPage);
  };
  
  const navigateToDashboard = () => navigateTo('admin-dashboard');
  
  const handleAccountNavigation = () => {
    if (!currentUser) {
      navigateTo('client-login');
    } else if (currentUser.role === 'Super Admin') {
      navigateTo('admin-dashboard');
    } else {
      navigateTo('client-account');
    }
  };

  const navigateToEnrollment = (course: Course) => {
    setSelectedCourseForEnrollment(course);
    navigateTo('enrollment');
  };
  
  const clientPages: Page[] = ['home', 'services', 'shop', 'book', 'gallery', 'cart', 'client-account', 'client-login', 'client-signup'];
  const adminMainPages: Page[] = ['admin-dashboard', 'admin-bookings', 'admin-orders', 'admin-settings'];
  
  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage currentUser={currentUser} onMenuClick={() => setIsMenuOpen(true)} navigateToServices={() => navigateTo('services')} navigateToTraining={() => navigateTo('training')} navigateToAbout={() => navigateTo('about')} navigateToContact={() => navigateTo('contact')} navigateToShop={() => navigateTo('shop')} navigateToSuccessStories={() => navigateTo('success-stories')} navigateToBook={() => navigateTo('book')} navigateToAccount={handleAccountNavigation} navigateToGallery={() => navigateTo('gallery')} services={services} />;
      case 'services': return <ServicesPage navigateToHome={() => navigateTo('home')} navigateToBook={() => navigateTo('book')} services={services} />;
      case 'training': return <TrainingPage navigateToHome={() => navigateTo('home')} onEnrollClick={navigateToEnrollment} courses={courses} />;
      case 'gallery': return <GalleryPage navigateToHome={() => navigateTo('home')} galleryItems={galleryItems} />;
      case 'about': return <AboutUsPage navigateToHome={() => navigateTo('home')} navigateToBook={() => navigateTo('book')} />;
      case 'contact': return <ContactPage navigateToHome={() => navigateTo('home')} settings={settings} />;
      case 'shop': return <ShopPage navigateToHome={() => navigateTo('home')} products={products} cart={cart} onAddToCart={handleAddToCart} navigateToCart={() => navigateTo('cart')} />;
      case 'cart': return <CartPage cart={cart} products={products} onUpdateCartItemQuantity={handleUpdateCartItemQuantity} onRemoveFromCart={handleRemoveFromCart} onBack={() => navigateTo('shop')} onPlaceOrder={handlePlaceOrder} />;
      case 'enrollment': return selectedCourseForEnrollment ? <EnrollmentPage course={selectedCourseForEnrollment} onEnrollSubmit={handleAddEnrollment} onBack={() => navigateTo('training')} /> : <TrainingPage navigateToHome={() => navigateTo('home')} onEnrollClick={navigateToEnrollment} courses={courses} />;
      case 'client-login': return <ClientLoginPage onLogin={handleLogin} navigateToSignUp={() => navigateTo('client-signup')} navigateToHome={() => navigateTo('home')} onForgotPasswordClick={handleForgotPassword} />;
      case 'client-signup': return <ClientSignUpPage onSignUp={handleSignUp} navigateToLogin={() => navigateTo('client-login')} />;
      case 'client-account': return <ClientAccountPage currentUser={currentUser} onLogout={handleLogout} />;
      case 'admin-login': return <AdminLoginPage onLogin={handleLogin} />;
      case 'admin-dashboard': return <AdminDashboardPage currentUser={currentUser} bookings={bookings} orders={orders} navigateToHome={() => navigateTo('home')} navigateToAdminServices={() => navigateTo('admin-services')} navigateToAdminTraining={() => navigateTo('admin-training')} navigateToAdminBookings={() => navigateTo('admin-bookings')} navigateToAdminProducts={() => navigateTo('admin-products')} navigateToAdminEnrollments={() => navigateTo('admin-enrollments')} navigateToAdminGallery={() => navigateTo('admin-gallery')} navigateToAdminSettings={() => navigateTo('admin-settings')} navigateToAdminOrders={() => navigateTo('admin-orders')} />;
      case 'admin-services': return <AdminServicesPage navigateToDashboard={navigateToDashboard} services={services} onAddService={handleAddService} onUpdateService={handleUpdateService} onDeleteService={handleDeleteService} />;
      case 'admin-training': return <AdminTrainingPage navigateToDashboard={navigateToDashboard} courses={courses} onAddCourse={handleAddCourse} onUpdateCourse={handleUpdateCourse} onDeleteCourse={handleDeleteCourse} />;
      case 'admin-bookings': return <AdminBookingsPage navigateToDashboard={navigateToDashboard} bookings={bookings} onUpdateBooking={handleUpdateBooking} onDeleteBooking={handleDeleteBooking} services={services} onAddBooking={handleAddBooking} />;
      case 'admin-products': return <AdminProductsPage navigateToDashboard={navigateToDashboard} products={products} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} />;
      case 'admin-enrollments': return <AdminEnrollmentsPage navigateToDashboard={navigateToDashboard} enrollments={enrollments} onUpdateEnrollment={handleUpdateEnrollment} onDeleteEnrollment={handleDeleteEnrollment} />;
      case 'admin-gallery': return <AdminGalleryPage navigateToDashboard={navigateToDashboard} galleryItems={galleryItems} onAddGalleryItem={handleAddGalleryItem} onUpdateGalleryItem={handleUpdateGalleryItem} onDeleteGalleryItem={handleDeleteGalleryItem} />;
      case 'admin-settings': 
        return <AdminSettingsPage 
          navigateToDashboard={navigateToDashboard} 
          settings={settings} 
          onUpdateSettings={handleUpdateSettings} 
          currentUser={currentUser} 
          onUpdateCurrentUserProfile={handleUpdateCurrentUserProfile} 
          onLogout={handleLogout}
          // Pass all data and setters for Cloud Sync functionality
          allData={{ services, products, courses, bookings, enrollments, galleryItems, settings, orders }}
          setters={{ setServices, setProducts, setCourses, setBookings, setEnrollments, setGalleryItems, setSettings, setOrders }}
        />;
      case 'reset-password': return <ResetPasswordPage navigateToLogin={() => navigateTo('client-login')} showToast={showToast} />;
      case 'admin-orders': return <AdminOrdersPage navigateToDashboard={navigateToDashboard} orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />;
      case 'book': return <BookPage navigateToHome={() => navigateTo('home')} services={services} onAddBooking={handleAddBooking} />;
      case 'success-stories': return <SuccessStoriesPage navigateToHome={() => navigateTo('home')} navigateToBook={() => navigateTo('book')} />;
      default: return <HomePage currentUser={currentUser} onMenuClick={() => setIsMenuOpen(true)} navigateToServices={() => navigateTo('services')} navigateToTraining={() => navigateTo('training')} navigateToAbout={() => navigateTo('about')} navigateToContact={() => navigateTo('contact')} navigateToShop={() => navigateTo('shop')} navigateToSuccessStories={() => navigateTo('success-stories')} navigateToBook={() => navigateTo('book')} navigateToAccount={handleAccountNavigation} navigateToGallery={() => navigateTo('gallery')} services={services} />;
    }
  };

  const showBottomNav = clientPages.includes(page) && !['client-login', 'client-signup'].includes(page);
  const showAdminBottomNav = adminMainPages.includes(page) && currentUser?.role === 'Super Admin';

  return (
    <div className="relative flex flex-col min-h-screen w-full">
      <Toast message={toast} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} navigateToHome={() => navigateTo('home')} navigateToServices={() => navigateTo('services')} navigateToTraining={() => navigateTo('training')} navigateToShop={() => navigateTo('shop')} navigateToGallery={() => navigateTo('gallery')} navigateToAbout={() => navigateTo('about')} navigateToContact={() => navigateTo('contact')} navigateToSuccessStories={() => navigateTo('success-stories')} navigateToBook={() => navigateTo('book')} navigateToAccount={handleAccountNavigation} />
      <div className="flex-1 pb-20">
        <div key={page} className="animate-fade-in">
          {renderPage()}
        </div>
      </div>
      {showBottomNav && <BottomNavBar currentUser={currentUser} activePage={page} navigateTo={navigateTo} onAccountClick={handleAccountNavigation} />}
      {showAdminBottomNav && <AdminBottomNavBar activePage={page} navigateTo={navigateTo} />}
    </div>
  );
};

export default App;