
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

import LandingPage from './pages/guest/LandingPage';
import LoginPage from './pages/guest/LoginPage';
import SignupPage from './pages/guest/SignupPage';
import Error404Page from './pages/guest/Error404Page';
import MarketPage from './pages/guest/MarketPage';
import RateExperience from './pages/user/RateExperience';
import ProductDetailsPage from './pages/guest/ProductDetailsPage';
import OwnListingsPage from './pages/user/OwnListingsPage';
import EditProductPage from './pages/user/EditProductPage';
import FavoriteProductsPage from './pages/user/FavoriteProductsPage';
import SellProductPage from './pages/user/SellProductPage';
import EditProfilePage from './pages/user/EditProfilePage';
import AdminLandingPage from './pages/admin/AdminLandingPage';
import UserListingsPage from './pages/guest/UserListingsPage';
import StyleOutfitPage from './pages/user/StyleOutfitPage';
import UserFaqPage from './pages/user/UserFaqPage';
import AskQuestionPage from './pages/user/AskQuestionPage';
import ResetPasswordPage from './pages/user/ResetPasswordPage';
import { SearchProvider } from './context/SearchContext';

import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminListedProductsPage from './pages/admin/AdminListedProductsPage';
import AdminFaqManagementPage from './pages/admin/AdminFaqManagementPage';
import UserDetailPage from './pages/admin/UserDetailPage';
import ManageProductPage from './pages/admin/ManageProductPage';
import AdminUserReviewsPage from './pages/admin/AdminUserReviewsPage';
import AdminUserReportsPage from './pages/admin/AdminUserReportsPage';
import AdminViewReportsPage from './pages/admin/AdminViewReportsPage';
import AdminViewSurveyPage from './pages/admin/AdminViewSurveyPage';
import AdminFaqPostPage from './pages/admin/AdminFaqPostPage';
import AdminViewFaqPage from './pages/admin/AdminViewFaqPage';

// Protect admin routes
const AdminRoute = ({ children }) => {
  const { user } = useAuthContext();

  // Check if the user is logged in and has the admin role
  if (!user || user.role !== 'admin') {
    return <Navigate to="/marketplace" />;  // Redirect if not admin
  }

  return children;  // Render the protected admin content if authenticated
};


function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path='/'
              element={
                user && user.role === 'admin'
                  ? <Navigate to="/admin" />
                  : <LandingPage />}
            />
            <Route
              path='/login'
              element={<LoginPage />}
            />
            <Route
              path='/signup'
              element={<SignupPage />}
            />
            <Route
              path='/marketplace'
              element={<MarketPage />}
            />

            <Route
              path="/style-outfit"
              element={<StyleOutfitPage />}
            />
            <Route
              path='/favorites'
              element={<FavoriteProductsPage />}
            />
            <Route
              path='/sell-product'
              element={<SellProductPage />}
            />
            <Route
              path='/own-listings'
              element={<OwnListingsPage />}
            />
            <Route
              path='/edit-product/:id'
              element={<EditProductPage />}
            />
            <Route
              path='/edit-profile'
              element={<EditProfilePage />}
            />
            <Route
              path='/product/:id'
              element={<ProductDetailsPage />}
            />
            <Route
              path="/rate-experience"
              element={<RateExperience />}
            />
            <Route
              path='/user/:userId'
              element={<UserListingsPage />}
            />
            <Route
              path="/faq"
              element={<UserFaqPage />}
            />
            <Route
              path="/ask-question"
              element={<AskQuestionPage />}
            />

            <Route
              path="/forgot-password"
              element={<ResetPasswordPage />}
            />
            <Route
              path='/admin'
              element={
                <AdminRoute>  {/* Protect admin landing page */}
                  <AdminLandingPage />
                </AdminRoute>
              }
            />
            <Route
              path='/admin/users'
              element={
                <AdminRoute>
                  <AdminUserManagementPage />
                </AdminRoute>
              }
            />
            <Route
              path='/admin/categories'
              element={
                <AdminRoute>
                  <AdminCategoriesPage />
                </AdminRoute>
              }
            />
            <Route
              path='/admin/products'
              element={
                <AdminRoute>
                  <AdminListedProductsPage />
                </AdminRoute>
              }
            />
            <Route
              path='/admin/faqs'
              element={
                <AdminRoute>
                  <AdminFaqManagementPage />
                </AdminRoute>
              }
            />
            <Route
              path='/admin/users/:userId'
              element={
                <AdminRoute>
                  <UserDetailPage />
                </AdminRoute>
              }
            />z
            <Route
              path='/admin/manage-product/:id'
              element={
                <AdminRoute>
                  <ManageProductPage />
                </AdminRoute>
              }
            />
            <Route
              path='/admin/reviews/user/:userId'
              element={
                <AdminRoute>
                  <AdminUserReviewsPage />
                </AdminRoute>
              }
            />
            <Route
              path='/admin/reports/user/:userId'
              element={
                <AdminRoute>
                  <AdminUserReportsPage />
                </AdminRoute>
              }
            />
            <Route
              path='/admin/reports'
              element={
                <AdminRoute>
                  <AdminViewReportsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/survey"
              element={<AdminViewSurveyPage />}
            />
            <Route
              path="/admin/faqs"
              element={<AdminFaqManagementPage />}
            />
            <Route
              path="/admin/faqs/post"
              element={<AdminFaqPostPage />}
            />
            <Route
              path="/admin/faqs/view"
              element={<AdminViewFaqPage />}
            />
            <Route
              path='*'
              element={<Error404Page />}
            />
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </div>
  );
}

export default App;
