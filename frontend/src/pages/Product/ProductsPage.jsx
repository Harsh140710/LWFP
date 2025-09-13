import { useState } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const categories = [
  { id: 1, name: "Electronics", products: [
    { id: 101, name: "Smartphone", price: 12999, image: "/images/phone.jpg", desc: "Latest Android phone with AMOLED display." },
    { id: 102, name: "Laptop", price: 45999, image: "/images/laptop.jpg", desc: "Powerful laptop for work and gaming." },
  ]},
  { id: 2, name: "Fashion", products: [
    { id: 201, name: "T-Shirt", price: 499, image: "/images/tshirt.jpg", desc: "Comfortable cotton T-shirt in multiple colors." },
    { id: 202, name: "Shoes", price: 1499, image: "/images/shoes.jpg", desc: "Stylish sneakers for casual wear." },
  ]},
];

const ProductsPage = () => {
  return (
    <div className="pt-20"> {/* padding for fixed header */}
      {/* Carousel */}
      <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
        <div><img src="/OIP-removebg-preview.png" alt="Banner 1" /></div>
        <div><img src="/OIP-removebg-preview.png" alt="Banner 2" /></div>
        <div><img src="/OIP-removebg-preview.png" alt="Banner 3" /></div>
      </Carousel>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {categories.map(cat => (
          <div key={cat.id} className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{cat.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {cat.products.map(prod => (
                <Link key={prod.id} to={`/products/${prod.id}`} className="border rounded-lg p-4 hover:shadow-lg">
                  <img src={prod.image} alt={prod.name} className="w-full h-40 object-cover rounded-md mb-2" />
                  <h3 className="font-semibold">{prod.name}</h3>
                  <p className="text-green-600 font-bold">₹{prod.price}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
