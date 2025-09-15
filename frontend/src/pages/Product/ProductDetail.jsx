import { useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const dummyProducts = {
  101: { name: "Smartphone", price: 12999, image: "https://www.bing.com/images/search?view=detailV2&ccid=hlhC0L07&id=55D44E6551353FD649F8742A51AE9406AAA4B669&thid=OIP.hlhC0L07E6Zfiek0L_kcAAHaFj&mediaurl=https%3a%2f%2fwallpaperaccess.com%2ffull%2f3046105.jpg&exph=2456&expw=3277&q=watch+img&FORM=IRPRST&ck=FFC5889763D07562E468C3CDA3698C88&selectedIndex=2&itb=0", desc: "Latest Android phone with AMOLED display." },
  102: { name: "Laptop", price: 45999, image: "https://www.bing.com/images/search?view=detailV2&ccid=hlhC0L07&id=55D44E6551353FD649F8742A51AE9406AAA4B669&thid=OIP.hlhC0L07E6Zfiek0L_kcAAHaFj&mediaurl=https%3a%2f%2fwallpaperaccess.com%2ffull%2f3046105.jpg&exph=2456&expw=3277&q=watch+img&FORM=IRPRST&ck=FFC5889763D07562E468C3CDA3698C88&selectedIndex=2&itb=0", desc: "Powerful laptop for work and gaming." },
  201: { name: "T-Shirt", price: 499, image: "https://www.bing.com/images/search?view=detailV2&ccid=hlhC0L07&id=55D44E6551353FD649F8742A51AE9406AAA4B669&thid=OIP.hlhC0L07E6Zfiek0L_kcAAHaFj&mediaurl=https%3a%2f%2fwallpaperaccess.com%2ffull%2f3046105.jpg&exph=2456&expw=3277&q=watch+img&FORM=IRPRST&ck=FFC5889763D07562E468C3CDA3698C88&selectedIndex=2&itb=0", desc: "Comfortable cotton T-shirt in multiple colors." },
  202: { name: "Shoes", price: 1499, image: "https://www.bing.com/images/search?view=detailV2&ccid=hlhC0L07&id=55D44E6551353FD649F8742A51AE9406AAA4B669&thid=OIP.hlhC0L07E6Zfiek0L_kcAAHaFj&mediaurl=https%3a%2f%2fwallpaperaccess.com%2ffull%2f3046105.jpg&exph=2456&expw=3277&q=watch+img&FORM=IRPRST&ck=FFC5889763D07562E468C3CDA3698C88&selectedIndex=2&itb=0", desc: "Stylish sneakers for casual wear." },
};

const ProductDetail = () => {
  const { id } = useParams();
  const product = dummyProducts[id];

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="pt-20 max-w-4xl mx-auto px-6 py-10">
      {product ? (
        <div className="flex flex-col md:flex-row gap-8">
          <img src={product.image} alt={product.name} className="w-full md:w-1/2 rounded-lg shadow-lg" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg mb-4">{product.desc}</p>
            <p className="text-2xl font-semibold text-green-600 mb-6">₹{product.price}</p>
            <div className="flex gap-4">
              <button onClick={addToCart} className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold">
                Add to Cart
              </button>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="flex items-center justify-center h-[calc(100vh-20vh)] w-full overflow-y-hidden">Product not found.</p>
      )}
    </div>
  );
};

export default ProductDetail;
