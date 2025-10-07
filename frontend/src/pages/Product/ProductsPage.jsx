"use client";

import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import toast from "react-hot-toast";
import axios from "axios";
import Header from "@/components/Header";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const priceRanges = [
  { label: "₹10,000 - ₹50,000", min: 10000, max: 50000 },
  { label: "₹50,000 - ₹1,00,000", min: 5000, max: 100000 },
  { label: "₹1,00,000 - ₹5,00,000", min: 100000, max: 500000 },
  { label: "₹5,00,000 - ₹10,000,000", min: 500000, max: 10000000 },
  { label: "₹10,000,000+", min: 1000000, max: Infinity },
];

const ProductsPage = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/products`
        );
        const data = res.data?.data || [];

        // Group products by category
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
        console.log("Error fetching products:", err);
        toast.error("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  // Get brands dynamically based on selected category
  useEffect(() => {
    if (selectedCategory === "All") {
      setBrands([]);
      return;
    }
    const category = categories.find((cat) => cat.name === selectedCategory);
    if (category) {
      const categoryBrands = Array.from(
        new Set(category.products.map((p) => p.brand).filter(Boolean))
      );
      setBrands(categoryBrands);
      setSelectedBrand("All");
    }
  }, [selectedCategory, categories]);

  // Filtering logic
  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const filteredProducts = cat.products.filter((prod) => {
          const matchesCategory =
            selectedCategory === "All" || cat.name === selectedCategory;
          const matchesBrand =
            selectedBrand === "All" || prod.brand === selectedBrand;
          const matchesSearch = prod.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const matchesPrice =
            !selectedPriceRange ||
            (prod.price >= selectedPriceRange.min &&
              prod.price <= selectedPriceRange.max);

          return matchesCategory && matchesBrand && matchesSearch && matchesPrice;
        });
        return { ...cat, products: filteredProducts };
      })
      .filter((cat) => cat.products.length > 0);
  }, [categories, selectedCategory, selectedBrand, searchTerm, selectedPriceRange]);

  return (
    <>
      <Header />
      <div className="pt-20 dark:bg-black dark:text-white min-h-screen">
        {/* Carousel */}
        <div className="w-full max-w-7xl mx-auto px-4">
          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            className="rounded-xl overflow-hidden"
          >
            <div>
              <img
                src="/Carousel-1.jpeg"
                alt="Banner 1"
                className="h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full object-cover"
              />
            </div>
            <div>
              <img
                src="/Carousel-1.png"
                alt="Banner 2"
                className="h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full object-cover"
              />
            </div>
            <div>
              <img
                src="/Carousel-3.png"
                alt="Banner 3"
                className="h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full object-cover"
              />
            </div>
          </Carousel>
        </div>

        {/* Filter Panel */}
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="block mb-2 font-semibold">Search</label>
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full"
            />
          </div>

          {/* Category Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block mb-2 font-semibold">Category</label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {categories.map((cat, idx) => (
                  <SelectItem key={idx} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand Filter (dependent on category) */}
          {selectedCategory !== "All" && (
            <div className="flex-1 min-w-[200px]">
              <label className="block mb-2 font-semibold">Brand</label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {brands.map((brand, idx) => (
                    <SelectItem key={idx} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Price Filter as Ghost Buttons */}
        {selectedCategory !== "All" && (
          <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3 flex-wrap">
            {priceRanges.map((range, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPriceRange(range)}
                className={`px-4 py-2 rounded-full border ${
                  selectedPriceRange === range
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-transparent text-black dark:text-white border-gray-400"
                } transition duration-200`}
              >
                {range.label}
              </button>
            ))}
            <button
              onClick={() => setSelectedPriceRange(null)}
              className="px-4 py-2 rounded-full border bg-transparent text-black dark:text-white border-gray-400"
            >
              Clear Price
            </button>
          </div>
        )}

        {/* Product Listings */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <div key={cat.id} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 uppercase underline">
                  {cat.name}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {cat.products.map((prod) => (
                    <Link key={prod._id} to={`/products/${prod._id}`}>
                      <Card className="hover:shadow-xl transition duration-300 rounded-2xl overflow-hidden bg-transparent">
                        <CardContent className="p-4 flex flex-col">
                          <img
                            src={prod.images?.[0]?.url || "/placeholder.jpg"}
                            alt={prod.title}
                            className="w-full h-40 md:h-48 lg:h-56 object-cover rounded-md mb-3"
                          />
                          <h3 className="font-semibold text-lg mb-1">
                            {prod.title}
                          </h3>
                          {prod.brand && (
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1 font-bold uppercase">
                              {prod.brand}
                            </p>
                          )}
                          <p className="text-green-600 dark:text-green-400 font-bold text-base">
                            ₹{prod.price}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No products found with this filter.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
