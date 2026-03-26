"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import { UserDataContext } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Plus, Minus, ArrowLeft, ShieldCheck, Truck } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false); // State for "Read More" logic

  const { addToCart } = useCart();
  const { user } = useContext(UserDataContext);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/products/${id}`);
        setProduct(res.data.data);

        if (res.data.data.category?._id) {
          const similarRes = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/v1/products?category=${res.data.data.category._id}`
          );
          setSimilarProducts(similarRes.data.data.filter((p) => p._id !== id).slice(0, 4));
        }
      } catch (err) {
        toast.error("Collection entry not found");
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleProtectedAction = (actionCallback) => {
    if (!user) {
      toast.error("Authenticity check required. Please login to continue.");
      navigate("/user/login", { state: { from: location.pathname } });
      return;
    }
    actionCallback();
  };

  const handleBuyNow = () => {
    handleProtectedAction(() => {
      navigate("/payment", {
        state: {
          products: [{ productId: product._id, title: product.title, price: product.price, quantity }],
        },
      });
    });
  };

  const handleAddToCart = () => {
    handleProtectedAction(() => {
      addToCart(product, quantity);
      toast.success("Secured in your cart");
    });
  };

  if (isLoading || !product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#050505] gap-6">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-white/5 rounded-full"></div>
          <div className="absolute inset-0 border-t-2 border-[#A37E2C] rounded-full animate-spin"></div>
        </div>
        <span className="text-[10px] tracking-[0.6em] uppercase text-[#A37E2C] font-bold animate-pulse">
          Authenticating Collection
        </span>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white selection:bg-[#A37E2C] selection:text-black">
      <Header />

      <main className="pt-32 pb-20 max-w-[1400px] mx-auto px-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-gray-400 hover:text-[#A37E2C] mb-12 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Vault
        </button>

        <div className="flex flex-col lg:flex-row gap-16 lg:items-start">
          
          <div className="lg:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.images?.map((img, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                key={idx} 
                className={`overflow-hidden bg-[#080808] border border-white/5 shadow-2xl ${idx === 0 ? "md:col-span-2 aspect-[16/10]" : "aspect-square"}`}
              >
                <img 
                  src={img.url} 
                  alt={product.title} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2.5s] ease-out hover:scale-105" 
                />
              </motion.div>
            ))}
          </div>

          <div className="lg:w-2/5 space-y-10 lg:sticky lg:top-32 h-fit">
            <div className="space-y-4">
              <p className="text-[11px] tracking-[0.5em] uppercase font-black text-[#A37E2C]">
                {product.brand || "Masterpiece Series"}
              </p>
              <h1 className="text-4xl md:text-7xl font-serif italic tracking-tighter leading-[0.9] uppercase text-white/95">
                {product.title}
              </h1>
              <p className="text-3xl font-light tracking-widest text-[#f5f5f5] pt-4">
                ₹{product.price.toLocaleString()}
              </p>
            </div>

            <div className="h-[1px] w-full bg-gradient-to-r from-white/20 to-transparent" />

            {/* CURATOR'S NOTE SECTION WITH READ MORE */}
            <div className="space-y-4">
              <h3 className="text-[10px] tracking-[0.4em] uppercase font-bold text-gray-500">Curator's Note</h3>
              <div className="relative">
                <p className={`text-sm leading-relaxed text-gray-400 font-light max-w-lg transition-all duration-700 ${!isExpanded ? "line-clamp-5" : ""}`}>
                  {product.description}
                </p>
                
                {product.description?.length > 250 && (
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 text-[10px] tracking-[0.3em] uppercase font-black text-[#A37E2C] hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    {isExpanded ? (
                      <>Show Less <Minus size={10} className="group-hover:rotate-180 transition-transform duration-500" /></>
                    ) : (
                      <>Read More <Plus size={10} className="group-hover:rotate-90 transition-transform duration-500" /></>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-8 pt-4">
              <div className="flex items-center gap-8">
                <span className="text-[10px] tracking-widest uppercase text-gray-500 font-bold">Quantity</span>
                <div className="flex items-center border border-white/10 px-5 py-3 gap-8 bg-black/50">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-gray-500 hover:text-[#A37E2C] transition-colors"><Minus size={14} /></button>
                  <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="text-gray-500 hover:text-[#A37E2C] transition-colors"><Plus size={14} /></button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 rounded-none h-16 bg-transparent border border-white/10 hover:border-[#A37E2C] hover:bg-white hover:text-black text-[10px] tracking-[0.4em] uppercase font-bold transition-all duration-700"
                >
                  Add to Cart
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  className="flex-1 rounded-none h-16 bg-[#A37E2C] text-black hover:bg-white transition-all duration-700 text-[10px] tracking-[0.4em] uppercase font-bold"
                >
                  Buy Now
                </Button>
              </div>
            </div>

            <div className="pt-10 space-y-5">
              <div className="flex items-center gap-5 text-gray-500">
                <ShieldCheck size={18} className="text-[#A37E2C]" />
                <span className="text-[9px] tracking-[0.4em] uppercase font-bold">Verified Authenticity</span>
              </div>
              <div className="flex items-center gap-5 text-gray-500">
                <Truck size={18} className="text-[#A37E2C]" />
                <span className="text-[9px] tracking-[0.4em] uppercase font-bold">Express Global Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PIECES */}
        {similarProducts.length > 0 && (
          <section className="mt-40 pt-24 border-t border-white/5">
            <h2 className="text-[11px] tracking-[0.6em] uppercase font-bold text-[#A37E2C] mb-20 text-center italic">Complementary Selection</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
              {similarProducts.map((prod) => (
                <Link to={`/products/${prod._id}`} key={prod._id} className="group">
                  <div className="aspect-[3/4] overflow-hidden bg-[#0a0a0a] border border-white/5 mb-8 group-hover:border-[#A37E2C]/40 transition-all duration-500">
                    <img src={prod.images?.[0]?.url || "/placeholder.jpg"} className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-[1.5s]" />
                  </div>
                  <p className="text-[9px] tracking-[0.4em] uppercase text-[#A37E2C] font-black mb-2">{prod.brand?.name || prod.brand 
                    || "TIMELESS ELEGANCE"}</p>
                  <h3 className="text-sm tracking-widest uppercase text-white font-light group-hover:text-[#A37E2C] transition-colors">{prod.title}</h3>
                  <p className="text-sm font-light tracking-[0.2em] text-gray-500 mt-3">₹{prod.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}