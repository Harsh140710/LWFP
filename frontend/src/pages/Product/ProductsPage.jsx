"use client";

import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import toast from "react-hot-toast";
import axios from "axios";
import Header from "@/components/Header";

// shadcn components
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const ProductsPage = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);

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

        // Collect unique brands
        const allBrands = Array.from(
          new Set(data.map((prod) => prod.brand).filter(Boolean))
        );
        setBrands(allBrands);
      } catch (err) {
        console.log("Error fetching products:", err);
        toast.error("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  // Filtering logic
  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const filteredProducts = cat.products.filter((prod) => {
          const matchesBrand =
            selectedBrand === "All" || prod.brand === selectedBrand;
          const matchesPrice = prod.price <= maxPrice;
          return matchesBrand && matchesPrice;
        });
        return { ...cat, products: filteredProducts };
      })
      .filter((cat) => cat.products.length > 0); // hide empty categories
  }, [categories, selectedBrand, maxPrice]);

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
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Brand Filter */}
          <div className="w-full sm:w-1/3">
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

          {/* Max Price Filter */}
          <div className="w-full sm:w-1/3">
            <label className="block mb-2 font-semibold">Max Price</label>
            <Input
              type="number"
              value={maxPrice}
              min={0}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Categories */}
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
                            alt={prod.name}
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
                            ${prod.price}
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
