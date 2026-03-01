import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Products from "./pages/Products"
import Cart from "./pages/Cart"
import Admin from "./pages/Admin"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"

import { CartProvider } from "./context/CartContext"
import { ProductProvider } from "./context/ProductContext"
import Sobre from "./pages/Sobre"
import ProductDetails from "./pages/ProductDetails"
function App() {
  return (
    <CartProvider>
      <ProductProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/carrinho" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/produto/:id" element={<ProductDetails />} />
            <Route
  path="/admin"
  element={
    <ProtectedRoute>
      <Admin />
    </ProtectedRoute>
  }
/>
          </Routes>
        </BrowserRouter>
      </ProductProvider>
    </CartProvider>
  )
}

export default App
