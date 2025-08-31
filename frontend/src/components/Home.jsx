import React from "react";
import Header from "./Header";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollAnimationWrapper } from "@/animation/ScrollAnimationWrapper";
import { containerVariant, itemVariant } from "@/animation/ScrollVarient";
import ServicesRing from "@/animation/ServicesRing";
import FloatingWatch from "@/animation/FloatingWatch";

// Animation with blur + left/right
const fadeInVariants = (direction = "left") => ({
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
    x: direction === "left" ? -80 : 80,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
});

const Watch = () => (
  <ScrollAnimationWrapper>
    <motion.div
      variants={fadeInVariants("right")}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      <model-viewer
        src="/golden_watch.glb"
        alt="Golden Watch"
        auto-rotate
        camera-controls
        shadow-intensity="1"
        style={{ width: "100%", height: "300px", display: "block" }}
        camera-orbit="80deg 30deg auto"
        field-of-view="auto"
        disable-zoom
      ></model-viewer>
    </motion.div>
  </ScrollAnimationWrapper>
);

const Home = () => {
  return (
    <div>
      <Header />

      <FloatingWatch />
      {/* Hero Section */}
      <div className="min-h-screen w-full lg:p-20 bg-[#F9FAFB] dark:bg-[#0B0B0D] flex flex-col lg:flex-row items-center justify-center gap-10">
        {/* Mobile Watch */}
        <motion.div
          className="w-full lg:hidden flex justify-center order-1"
          variants={fadeInVariants("left")}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* <div className="w-full max-w-md px-4">
            <Watch />
          </div> */}
        </motion.div>

        {/* Text Section */}
        <motion.div
          variants={fadeInVariants("right")}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl order-2 lg:order-1"
        >
          <motion.h1 className="font-bold sm:text-2xl md:text-3xl lg:text-4xl text-2xl mb-5 text-[#111827] dark:text-[#F9FAFB]">
            Redefining{" "}
            <span
              style={{ fontFamily: "'Great Vibes', cursive" }}
              className="text-[#B48E57]"
            >
              Luxury
            </span>
            &nbsp;, One Timeless Moment at a Time
          </motion.h1>

          <motion.p className="text-[#111827] dark:text-[#FEFEFE] mb-5">
            Discover our curated collection of premium watches crafted for
            elegance and precision.
          </motion.p>

          <div className="mt-3 flex flex-row gap-3 w-full justify-center lg:justify-start">
            <Link
              to="/product"
              className="bg-[#B48E57] text-white uppercase px-4 py-2 rounded-xl font-bold min-w-[140px] text-center"
            >
              Shop Now
            </Link>

            <button
              type="button"
              className="relative border-2 border-[#B48E57] px-4 py-2 rounded-xl min-w-[140px] flex items-center justify-center hover:cursor-pointer"
            >
              <span className="pr-2 text-[#B48E57] font-bold">
                Explore Collection
              </span>
              <MoveRight className="size-[1.2rem] text-[#B48E57]" />
            </button>
          </div>
        </motion.div>

        {/* Desktop Watch */}
        <motion.div
          className="hidden lg:flex w-1/2 justify-center order-2"
          variants={fadeInVariants("left")}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="w-full max-w-md">{/* <Watch /> */}</div>
        </motion.div>
      </div>

      {/* Featured Collection */}
      <div className="py-12 bg-[#F9FAFB] dark:bg-[#0B0B0D]">
        <h2 className="text-center font-bold lg:text-3xl md:text-2xl text-xl py-6 -mt-20 mb-20 underline">
          Featured Collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-16">
          {[
            {
              id: 1,
              img: "/OIP-removebg-preview.png",
              description:
                "A Rolex without mechanical movement offers the timeless elegance of the brand while running on a quartz battery-powered system. It delivers unmatched accuracy and requires very little maintenance apart from occasional battery replacement, making it convenient for everyday wear. Although it does not carry the intricate craftsmanship of traditional Rolex engineering, it still embodies the luxury design, durability, and prestige that the name Rolex represents.",
            },
            { id: 2, img: null, description: "" }, // 🔥 empty slot for animation
            {
              id: 3,
              img: "/Macanic_Watch-removebg-preview.png",
              description: "",
            },
          ].map((item, i) => (
            <motion.div
              key={item.id}
              variants={fadeInVariants(i % 2 === 0 ? "left" : "right")}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="relative group flex flex-col border-2 border-[#B48E57] rounded-xl overflow-hidden"
            >
              <div className="bg-[#FEFEFE] dark:bg-[#0B0B0D] w-full aspect-square flex items-center justify-center">
                {item.img ? (
                  item.img.endsWith(".glb") || item.img.endsWith(".gltf") ? (
                    <model-viewer
                      src={item.img}
                      alt="Luxury Watch"
                      auto-rotate
                      camera-controls
                      shadow-intensity="1"
                      style={{
                        width: "100%",
                        height: "100%",
                        maxHeight: "14rem",
                      }}
                      camera-orbit="80deg 30deg auto"
                      field-of-view="auto"
                      disable-zoom
                    ></model-viewer>
                  ) : (
                    <img
                      src={item.img}
                      alt="Luxury Watch"
                      className="w-full h-full object-contain scale-[1.2]"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {/* 🔥 Empty space for your animation */}
                  </div>
                )}
              </div>

              {/* Hover Overlay */}
              <div
                className="absolute inset-0 flex flex-col p-5 items-center justify-center
              backdrop-blur-sm bg-[#B48E57]
              opacity-0 group-hover:opacity-70
              transition-all duration-500 ease-in-out"
              >
                <p className="text-[#FEFEFE] font-semibold mb-10">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem nemo quo ipsa repellat, officia earum reiciendis fugiat ipsum? Eaque, tempora asperiores velit magni fugit labore quo sunt reiciendis vitae dignissimos similique pariatur, ipsam exercitationem dolores nulla perferendis laudantium ipsa facere repudiandae ratione numquam amet consectetur eius adipisci! Quisquam, reprehenderit asperiores.
                </p>
                <Link
                  to={"/products"}
                  className="text-[#FEFEFE] underline uppercase text-lg sm:text-xl font-bold"
                >
                  Collection
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 📌 Our Services in Animated Rotating Ring */}
        <ServicesRing />
      </div>

      {/* 📌 Brand Values */}
      {/* 📌 Brand Values with Infinite Scroll (Single Row, Responsive) */}
      <section className="py-16 px-6 bg-[#F9FAFB] dark:bg-[#0B0B0D] text-center overflow-hidden">
        <h2 className="text-3xl font-bold mb-20 text-[#111827] dark:text-white">
          Why Choose Us
        </h2>

        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex gap-6 flex-nowrap"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Infinity,
              duration: 25,
              ease: "linear",
            }}
          >
            {[...Array(2)].map((_, loopIndex) =>
              [
                "Swiss Movement",
                "Premium Materials",
                "Handcrafted",
                "2-Year Warranty",
                "Luxury Design",
                "Lifetime Service",
                "Global Shipping",
                "Eco Packaging",
              ].map((value, i) => (
                <div
                  key={`${loopIndex}-${i}`}
                  className="min-w-[180px] sm:min-w-[220px] md:min-w-[250px] lg:min-w-[300px]
              p-6 bg-white dark:bg-[#111] rounded-xl shadow-md
              hover:bg-[#B48E57]  dark:hover:bg-[#B48E57] hover:text-white transition-all duration-300"
                >
                  <h3 className="text-base sm:text-lg font-semibold text-[#111827]  hover:text-[#FEFEFE] dark:text-white">
                    {value}
                  </h3>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* 📌 Lifestyle Section */}
      <section
        className="py-16 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/lifestyle-bg.jpg')" }}
      >
        <div className="bg-gradient-to-br from-[#B48E57] to-[#FEFEFE] dark:bg-gradient-to-br dark:from-[#B48E57] dark:to-[#111] dark:bg-[#111] absolute inset-0"></div>
        <motion.div
          variants={fadeInVariants("up")}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative text-center dark:text-white max-w-3xl mx-auto px-6"
        >
          <h2 className="text-4xl font-bold mb-4">More than a Timepiece</h2>
          <p className="text-lg">
            A legacy of style, precision, and timeless elegance.
          </p>
        </motion.div>
      </section>

      {/* 📌 What Our Customers Say */}
      <section className="py-16 px-6 bg-white dark:bg-[#0B0B0D] text-center overflow-hidden">
        <h2 className="text-3xl font-bold mb-20 text-[#111827] dark:text-white">
          What Our Customers Say
        </h2>

        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex gap-6 flex-nowrap"
            animate={{ x: ["-100%", "0%"] }}
            transition={{
              repeat: Infinity,
              duration: 30, // slow smooth scroll
              ease: "linear",
            }}
          >
            {[...Array(2)].map((_, loopIndex) =>
              [
                {
                  name: "Aarav S.",
                  text: "The craftsmanship is outstanding. Feels truly premium!",
                },
                {
                  name: "Emily R.",
                  text: "Absolutely love my watch – elegant and timeless design.",
                },
                {
                  name: "Daniel K.",
                  text: "Customer service was fantastic, shipping was fast.",
                },
                {
                  name: "Sophia M.",
                  text: "I get compliments every time I wear it. Worth every penny!",
                },
              ].map((review, i) => (
                <div
                  key={`${loopIndex}-${i}`}
                  className="min-w-[250px] sm:min-w-[300px] md:min-w-[350px] lg:min-w-[400px] 
              p-6 bg-[#F9FAFB] dark:bg-[#111] dark:hover:bg-[#B48E57] rounded-xl shadow-md text-left
              hover:bg-[#B48E57] hover:text-white transition-all duration-300"
                >
                  <p className="text-sm sm:text-base italic mb-3">
                    “{review.text}”
                  </p>
                  <h4 className="text-sm sm:text-lg font-semibold">
                    - {review.name}
                  </h4>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* 📌 Call to Action */}
      <section className="py-16 px-6 text-center bg-[#B48E57] text-white">
        <h2 className="text-3xl font-bold mb-4">Own Your Timeless Luxury</h2>
        <p className="mb-6">Discover exclusive watches crafted for elegance.</p>
        <Link
          to="/product"
          className="bg-white text-[#B48E57] px-6 py-3 rounded-xl font-semibold shadow-lg"
        >
          Shop Now
        </Link>
      </section>

      {/* 📌 Footer */}
      <footer className="py-8 px-6 bg-[#0B0B0D] text-gray-400 text-center">
        <p>
          &copy; {new Date().getFullYear()} Timeless Luxury. All Rights
          Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
