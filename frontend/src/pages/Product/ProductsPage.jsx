"use client";

import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import Header from "@/components/Header";
import { Search, X } from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const priceRanges = [
  { label: "Under ₹50k", min: 0, max: 50000 },
  { label: "₹50k - ₹1L", min: 50000, max: 100000 },
  { label: "₹1L - ₹5L", min: 100000, max: 500000 },
  { label: "Premium Selection", min: 500000, max: 10000000 },
];

const ProductsPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/products`);
        const data = res.data?.data || [];
        const grouped = data.reduce((acc, product) => {
          const categoryName = product.category?.name || "Uncategorized";
          if (!acc[categoryName]) acc[categoryName] = [];
          acc[categoryName].push(product);
          return acc;
        }, {});
        const formatted = Object.keys(grouped).map((cat, i) => ({
          id: i + 1,
          name: cat,
          products: grouped[cat],
        }));
        setCategories(formatted);
      } catch (err) {
        toast.error("Collection unavailable at the moment.");
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    };
    fetchProducts();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const filteredProducts = cat.products.filter((prod) => {
          const matchesCategory = selectedCategory === "All" || cat.name === selectedCategory;
          const matchesSearch = prod.title.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesPrice = !selectedPriceRange || (prod.price >= selectedPriceRange.min && prod.price <= selectedPriceRange.max);
          return matchesCategory && matchesSearch && matchesPrice;
        });
        return { ...cat, products: filteredProducts };
      })
      .filter((cat) => cat.products.length > 0);
  }, [categories, selectedCategory, searchTerm, selectedPriceRange]);

  return (
    <div className="bg-[#050505] min-h-screen text-white selection:bg-[#A37E2C] selection:text-black">
      <Header />

      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 h-[2px] bg-[#A37E2C] z-[200] shadow-[0_0_15px_#A37E2C]"
          />
        )}
      </AnimatePresence>

      <main className="pt-32 lg:pt-44">
        {/* HERO SECTION */}
        <section className="max-w-[1400px] mx-auto px-6 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="border-l border-white/10 pl-8"
          >
            <h2 className="text-[10px] tracking-[0.8em] uppercase font-bold text-[#A37E2C] mb-4">
              Curated Collection
            </h2>
            <h1 className="text-5xl md:text-8xl font-serif italic tracking-tighter leading-none mb-6">
              The Art of <br /> Timelessness
            </h1>
          </motion.div>
        </section>

        {/* SEARCH & FILTER BAR - Increased Padding & Fixed Z-Index */}
        <nav className="sticky top-16 z-[100] bg-black/90 backdrop-blur-xl border-y border-white/10 py-10 shadow-2xl">
          <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
            
            {/* Minimal Search with increased vertical padding */}
            <div className="relative w-full md:w-[450px] group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#A37E2C] transition-colors" />
              <input 
                type="text"
                placeholder="FIND A PIECE..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none pl-10 text-[11px] tracking-[0.4em] uppercase focus:ring-0 placeholder:text-gray-700 py-2"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-4">
                <span className="text-[10px] tracking-widest text-gray-500 uppercase">Category:</span>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 bg-transparent border-none text-[10px] tracking-[0.2em] uppercase font-bold h-auto p-0 focus:ring-0 hover:text-[#A37E2C] transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  {/* portal: false ensures the dropdown renders near the button and follows z-index rules */}
                  <SelectContent className="bg-black border border-white/10 text-white rounded-none z-[110]">
                    <SelectItem value="All" className="text-[10px] tracking-widest uppercase">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name} className="text-[10px] tracking-widest uppercase">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="hidden xl:flex items-center gap-8">
                {priceRanges.map((range, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPriceRange(range)}
                    className={`text-[9px] tracking-[0.3em] uppercase transition-all duration-300 ${
                      selectedPriceRange === range ? "text-[#A37E2C] border-b border-[#A37E2C] pb-1" : "text-gray-500 hover:text-white"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
                {selectedPriceRange && (
                  <X size={14} className="cursor-pointer text-red-800 hover:scale-110 transition-transform" onClick={() => setSelectedPriceRange(null)} />
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* PRODUCT SECTION */}
        <section className="max-w-[1400px] mx-auto px-6 py-20">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <div key={cat.id} className="mb-32">
                <div className="flex items-baseline gap-6 mb-16">
                  <h2 className="text-4xl font-serif italic">{cat.name}</h2>
                  <div className="h-[1px] flex-1 bg-white/5" />
                  <span className="text-[10px] tracking-[0.4em] text-gray-600 uppercase font-bold">
                    {cat.products.length} Models
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-28">
                  {cat.products.map((prod, index) => (
                    <motion.div 
                      key={prod._id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link to={`/products/${prod._id}`} className="group block">
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#080808] mb-8 border border-white/5 group-hover:border-[#A37E2C]/40 transition-all duration-700 shadow-lg">
                          <img 
                            src={prod.images?.[0]?.url || "/placeholder.jpg"} 
                            className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-[2s] ease-out grayscale group-hover:grayscale-0"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-[10px] tracking-[0.4em] uppercase text-[#A37E2C] font-black">{prod.brand}</p>
                          <h3 className="text-xl font-serif tracking-tight text-white group-hover:text-[#A37E2C] transition-colors uppercase">{prod.title}</h3>
                          <p className="text-sm font-light tracking-[0.2em] text-gray-500">₹{prod.price.toLocaleString()}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border border-white/5 space-y-4">
              <p className="italic text-gray-500 tracking-[0.3em] uppercase text-xs">No matches found in our vault.</p>
              <button onClick={() => {setSearchTerm(""); setSelectedPriceRange(null); setSelectedCategory("All");}} className="text-[10px] text-[#A37E2C] underline tracking-widest uppercase">Clear All Filters</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProductsPage;