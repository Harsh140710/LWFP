"use client";

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/products/${id}`
        );
        setProduct(res.data.data);

        // Fetch similar products by category
        if (res.data.data.category?._id) {
          const similarRes = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/v1/products?category=${res.data.data.category._id}`
          );
          setSimilarProducts(similarRes.data.data.filter((p) => p._id !== id));
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      }
    };
    fetchProduct();
  }, [id]);

  const handleBuyNow = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/payment/create-checkout-session`,
        {
          products: [
            {
              productId: product._id,
              title: product.title,
              price: product.price,
              quantity,
            },
          ],
        },
        { withCredentials: true }
      );

      if (res.data.url) {
        window.location.href = res.data.url; // Redirect to Stripe
      } else {
        toast.error("Failed to start checkout");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment initialization failed");
    }
  };

  if (!product) {
    return <p className="text-center mt-20">Loading product details...</p>;
  }

  const description = product.description || "No description available.";
  const truncatedDescription =
    description.length > 200 ? description.slice(0, 200) + "..." : description;

  return (
    <>
      <Header />
      <div className="pt-25 pb-10 mx-auto px-4 sm:px-6 lg:px-8 dark:bg-black">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Carousel */}
          <div className="lg:w-1/2">
            <Carousel
              showThumbs={true}
              showStatus={false}
              infiniteLoop
              autoPlay
              className="rounded-lg shadow-lg dark:shadow-none"
            >
              {product.images?.map((img, idx) => (
                <div key={idx} className="bg-white dark:bg-black p-2 rounded-lg">
                  <img
                    src={img.url}
                    alt={product.title}
                    className="object-cover rounded-lg max-h-[350px]"
                  />
                </div>
              ))}
            </Carousel>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-black dark:text-white">
              {product.title}
            </h1>
            {product.brand && (
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold">
                {product.brand}
              </p>
            )}
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ₹{product.price}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-semibold text-black dark:text-white">
                Quantity:
              </span>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  addToCart(product, quantity);
                  toast.success("Added to cart!");
                }}
              >
                Add to Cart
              </Button>

              <Button
                className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>

            {/* Product Description */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {showFullDescription ? description : truncatedDescription}
                {description.length > 200 && (
                  <span
                    className="text-blue-500 cursor-pointer ml-1"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? "Show less" : "Read more"}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((prod) => (
                <Link to={`/products/${prod._id}`} key={prod._id}>
                  <div className="p-5 bg-white dark:bg-black rounded-lg shadow-lg hover:shadow-xl transition border">
                    <img
                      src={prod.images?.[0]?.url || "/placeholder.jpg"}
                      alt={prod.title}
                      className="object-cover rounded-md h-40 w-full border"
                    />
                    <h3 className="mt-5 font-semibold text-black dark:text-white">
                      {prod.title}
                    </h3>
                    <p className="text-green-600 dark:text-green-400 font-bold">
                      ₹{prod.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
