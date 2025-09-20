import React from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import "@google/model-viewer";
import Footer from "./Footer";

const AboutUs = () => {
  return (
    <div className="bg-gray-50 dark:bg-[#0B0B0D] text-gray-900 dark:text-white">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-white dark:bg-black py-32 px-6 text-center">
        <div className="relative">
          <motion.div
            style={{
              position: "absolute",
              top: "-35px", // adjust to lift it above the heading
              left: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "none",
            }}
          >
            <model-viewer
              src="/golden_watch.glb"
              alt="Floating Watch"
              auto-rotate
              // camera-controls
              camera-orbit="30deg 25deg auto"
              disable-zoom
              style={{ width: "280px", height: "280px" }}
            />
          </motion.div>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-extrabold text-black dark:text-white mb-6 mt-60"
        >
          Timeless Elegance
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg md:text-xl max-w-3xl mx-auto dark:text-white"
        >
          Crafting timeless elegance with precision and passion. Our journey is
          built on trust, craftsmanship, and dedication to creating
          extraordinary watches and accessories.
        </motion.p>
      </section>

      {/* Our Story */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-black dark:text-white mb-6">
            Our Story
          </h2>
          <p className="text-gray-900 dark:text-white leading-relaxed text-lg mb-4">
            Founded in [Year], [Your Brand Name] began as a small workshop with
            a vision: to create exquisite watches and accessories that combine
            elegance with functionality. Every piece we craft reflects a
            commitment to timeless design, precision, and artistry.
          </p>
          <p className="text-gray-900 dark:text-white leading-relaxed text-lg">
            Over the years, we have evolved from a niche boutique to an
            internationally recognized brand. With every creation, we honor
            traditional craftsmanship while embracing modern innovation. Our
            artisans meticulously design each watch to embody perfection and
            reliability.
          </p>
        </motion.div>

        {/* Vision & Mission */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 grid md:grid-cols-2 gap-12"
        >
          <div className="bg-[#E3F6F5] dark:bg-[#1E1E1E] p-8 rounded-2xl shadow-lg">
            <h3 className="text-3xl font-semibold mb-4 text-[#2E7D32] dark:text-[#A5D6A7]">
              Our Vision
            </h3>
            <p className="text-gray-900 dark:text-white text-lg leading-relaxed">
              To be the benchmark in luxury watches, merging classic
              craftsmanship with modern design, and creating pieces that are
              treasured for generations.
            </p>
          </div>
          <div className="bg-[#E3F6F5] dark:bg-[#1E1E1E] p-8 rounded-2xl shadow-lg">
            <h3 className="text-3xl font-semibold mb-4 text-[#2E7D32] dark:text-[#A5D6A7]">
              Our Mission
            </h3>
            <p className="text-gray-900 dark:text-white text-lg leading-relaxed">
              To design, craft, and deliver the finest watches and accessories
              with a focus on quality, style, and sustainability, ensuring a
              memorable experience for every customer.
            </p>
          </div>
        </motion.div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-black dark:text-white mb-10 text-center">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-[#F0FFF0] dark:bg-[#111111] p-6 rounded-xl shadow-md text-center">
              <h3 className="font-semibold text-2xl mb-2 text-[#2E7D32] dark:text-[#A5D6A7]">
                Integrity
              </h3>
              <p className="text-gray-900 dark:text-white">
                Transparency and honesty guide every decision we make.
              </p>
            </div>
            <div className="bg-[#F0FFF0] dark:bg-[#111111] p-6 rounded-xl shadow-md text-center">
              <h3 className="font-semibold text-2xl mb-2 text-[#2E7D32] dark:text-[#A5D6A7]">
                Excellence
              </h3>
              <p className="text-gray-900 dark:text-white">
                We pursue perfection in design, quality, and service.
              </p>
            </div>
            <div className="bg-[#F0FFF0] dark:bg-[#111111] p-6 rounded-xl shadow-md text-center">
              <h3 className="font-semibold text-2xl mb-2 text-[#2E7D32] dark:text-[#A5D6A7]">
                Innovation
              </h3>
              <p className="text-gray-900 dark:text-white">
                We merge tradition with modern technology and design.
              </p>
            </div>
            <div className="bg-[#F0FFF0] dark:bg-[#111111] p-6 rounded-xl shadow-md text-center">
              <h3 className="font-semibold text-2xl mb-2 text-[#2E7D32] dark:text-[#A5D6A7]">
                Customer Focus
              </h3>
              <p className="text-gray-900 dark:text-white">
                Customer satisfaction is at the heart of everything we do.
              </p>
            </div>
            <div className="bg-[#F0FFF0] dark:bg-[#111111] p-6 rounded-xl shadow-md text-center">
              <h3 className="font-semibold text-2xl mb-2 text-[#2E7D32] dark:text-[#A5D6A7]">
                Sustainability
              </h3>
              <p className="text-gray-900 dark:text-white">
                We source responsibly and prioritize eco-friendly practices.
              </p>
            </div>
            <div className="bg-[#F0FFF0] dark:bg-[#111111] p-6 rounded-xl shadow-md text-center">
              <h3 className="font-semibold text-2xl mb-2 text-[#2E7D32] dark:text-[#A5D6A7]">
                Passion
              </h3>
              <p className="text-gray-900 dark:text-white">
                We are driven by our love for craft, design, and perfection.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Extended Team Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-black dark:text-white mb-10 text-center">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              "Harsh Suthar",
              "Mohit Tundiya",
              "Nihal Chavda",
              "Sujata Mudaliyar",
            ].map((name, i) => (
              <div key={i} className="text-center">
                <img
                  src={`/team${i + 1}.jpg`}
                  alt={name}
                  className="w-48 h-48 rounded-full mx-auto mb-4 object-cover border-4 border-green-500 dark:border-[#A5D6A7]"
                />
                <h3 className="font-semibold text-xl mb-1">{name}</h3>
                <p className="text-gray-900 dark:text-white">
                  {i === 0
                    ? "Founder & CEO"
                    : i === 1
                    ? "Head of Design"
                    : i === 2
                    ? "Product Designer"
                    : i === 3
                    ? "Opration Manager"
                    : "Product Designer"}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl font-bold text-black dark:text-white mb-12">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sophia Lee",
                text: "The craftsmanship is impeccable, and the customer service is top-notch!",
              },
              {
                name: "Michael Brown",
                text: "I’ve never owned a watch this elegant. Truly a timeless piece.",
              },
              {
                name: "Olivia Davis",
                text: "Exceptional design and quality. I highly recommend them!",
              },
              {
                name: "David Wilson",
                text: "Amazing attention to detail. Every watch tells a story.",
              },
              {
                name: "Emma Clark",
                text: "Luxury meets perfection. Absolutely love it!",
              },
              {
                name: "James Miller",
                text: "Professional service and exquisite products.",
              },
            ].map((review, i) => (
              <div
                key={i}
                className="bg-[#E3F6F5] dark:bg-[#1E1E1E] p-6 rounded-xl shadow-md"
              >
                <p className="text-lg italic mb-4 text-gray-900 dark:text-white">
                  "{review.text}"
                </p>
                <p className="font-semibold text-[#2E7D32] dark:text-[#A5D6A7]">
                  - {review.name}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Timeline / Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 max-w-5xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-black dark:text-white mb-12 text-center">
            Our Journey
          </h2>
          <div className="space-y-8">
            {[
              {
                year: "2010",
                milestone:
                  "Founded with a small team of passionate watchmakers.",
              },
              {
                year: "2013",
                milestone: "Launched our first limited-edition collection.",
              },
              {
                year: "2016",
                milestone: "Expanded internationally, reaching Europe & Asia.",
              },
              {
                year: "2020",
                milestone:
                  "Introduced sustainable materials and eco-friendly practices.",
              },
              {
                year: "2023",
                milestone: "Recognized as a premium luxury brand worldwide.",
              },
            ].map((event, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row md:items-center gap-4"
              >
                <span className="text-black dark:text-white font-bold text-xl w-24">
                  {event.year}
                </span>
                <p className="text-gray-900 dark:text-white text-lg">
                  {event.milestone}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center py-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-black dark:text-white">
            Discover Our Collection
          </h2>
          <p className="text-gray-900 dark:text-white mb-6 text-lg max-w-2xl mx-auto">
            Explore our range of exquisite watches and accessories, designed to
            combine elegance, precision, and durability. Join a community of
            enthusiasts who value timeless style.
          </p>
          <a
            href="/products"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-10 rounded-lg transition"
          >
            Explore Collection
          </a>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
};

export default AboutUs;
