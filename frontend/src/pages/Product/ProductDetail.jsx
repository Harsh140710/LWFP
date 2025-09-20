import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Header from "@/components/Header";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/products/${id}`
        );
        setProduct(res.data?.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-20vh)]">
        <p className="font-bold">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-20vh)]">
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="pt-20 h-screen w-full mx-auto px-6 py-10 dark:bg-black">
        <div className="flex flex-col md:flex-row gap-10 bg-white shadow-lg rounded-xl p-6 dark:bg-black">
          {/* Product Image */}
          <div className="flex-1">
            <img
              src={product.images?.[0]?.url || "/placeholder.jpg"}
              alt={product.name}
              className="w-full rounded-lg shadow-md object-cover h-[250px] bg-cover cursor-pointer"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              <p className="text-lg dark:text-white mb-4">
                {product.description || "No description available."}
              </p>
              <p className="text-2xl font-semibold text-green-600 mb-6">
                ${product.price}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={addToCart}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer"
              >
                Add to Cart
              </button>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
