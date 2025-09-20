"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import toast from "react-hot-toast";
import axios from "axios";
import Header from "@/components/Header";

const ProductsPage = () => {
  const [categories, setCategories] = useState([]);

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

  return (
    <>
      <Header />
      <div className="pt-20 dark:bg-black dark:text-white">
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

        {/* Categories */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          {categories.map((cat) => (
            <div key={cat.id} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 uppercase underline">
                {cat.name}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {cat.products.map((prod) => (
                  <Link
                    key={prod._id}
                    to={`/products/${prod._id}`}
                    className="border rounded-xl p-4 hover:shadow-xl transition duration-300 bg-white flex flex-col"
                  >
                    <img
                      src={prod.images?.[0]?.url || "/placeholder.jpg"}
                      alt={prod.name}
                      className="w-full h-40 md:h-48 lg:h-56 object-cover rounded-md mb-3"
                    />
                    {/* Product Title */}
                    <h3 className="font-semibold text-lg mb-1">{prod.title}</h3>
                    {/* Brand */}
                    {prod.brand && (
                      <p className="text-gray-500 text-sm mb-1 font-bold uppercase">
                        {prod.brand}
                      </p>
                    )}
                    {/* Price */}
                    <p className="text-green-600 font-bold text-base">
                      ${prod.price}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
