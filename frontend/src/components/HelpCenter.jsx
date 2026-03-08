"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  ChevronDown, 
  Search, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  Mail 
} from "lucide-react";

const faqs = [
  {
    category: "Logistics",
    question: "How can I track my order?",
    answer: "Visit the 'My Orders' section within your profile vault. Each shipment is assigned a unique tracking signature provided by our global logistics partners.",
  },
  {
    category: "Management",
    question: "How do I cancel an order?",
    answer: "Orders can be rescinded only before the authentication process begins. Navigate to 'My Orders' to view eligibility for cancellation.",
  },
  {
    category: "Security",
    question: "How do I change my password?",
    answer: "Security credentials can be updated within the 'Settings' tab of your profile. We recommend rotating keys every 90 days for maximum security.",
  },
  {
    category: "Concierge",
    question: "How do I contact support?",
    answer: "Our specialists are available via the ticket system below, or you may reach our executive desk directly at support@luxuryvault.com.",
  },
];

export default function HelpCenter() {
  const [openIndex, setOpenIndex] = useState(null);
  const [message, setMessage] = useState("");

  const submitTicket = () => {
    if (!message.trim()) return toast.error("MESSAGE REQUIRED");
    
    toast.success("TICKET SUBMITTED", {
      description: "A specialist will review your request shortly.",
    });
    setMessage("");
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white px-6 py-20 selection:bg-[#A37E2C] selection:text-black">
      <div className="max-w-[1000px] mx-auto space-y-24">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-6">
          <p className="text-[10px] tracking-[0.6em] uppercase font-bold text-[#A37E2C]">Concierge Services</p>
          <h1 className="text-5xl md:text-7xl font-serif italic tracking-tighter uppercase leading-none">
            How can we <br /> assist you?
          </h1>
          <div className="relative max-w-xl mx-auto mt-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH THE KNOWLEDGE BASE..." 
              className="w-full bg-white/5 border border-white/10 py-5 px-12 text-[10px] tracking-widest uppercase focus:outline-none focus:border-[#A37E2C] transition-colors"
            />
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-16">
          
          {/* LEFT: FAQS */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-2">
              <h2 className="text-[11px] tracking-[0.4em] uppercase font-bold text-gray-500 mb-8">Frequent Inquiries</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div 
                    key={index}
                    className="group border-b border-white/5 pb-4 cursor-pointer"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <div className="flex justify-between items-center py-4">
                      <div className="space-y-1">
                        <span className="text-[8px] tracking-[0.3em] uppercase text-[#A37E2C] font-black">{faq.category}</span>
                        <p className="text-sm tracking-widest uppercase font-light group-hover:text-[#A37E2C] transition-colors">
                          {faq.question}
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                        className="text-gray-600"
                      >
                        <ChevronDown size={20} />
                      </motion.div>
                    </div>
                    
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-400 text-sm leading-relaxed font-light pb-6 max-w-xl">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: TICKET FORM */}
          <aside className="space-y-8">
            <Card className="bg-[#080808] border border-white/5 rounded-none p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-white">Direct Inquiry</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-tighter">
                  If your answer is not listed, please submit a formal ticket.
                </p>
              </div>

              <textarea
                className="w-full bg-black border border-white/10 p-4 text-sm text-gray-300 focus:outline-none focus:border-[#A37E2C] transition-all placeholder:text-[9px] placeholder:tracking-widest placeholder:uppercase"
                rows={5}
                placeholder="DETAILS OF YOUR INQUIRY..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <Button
                className="w-full rounded-none h-14 bg-[#A37E2C] text-black hover:bg-white transition-all duration-700 text-[10px] tracking-[0.4em] uppercase font-bold"
                onClick={submitTicket}
              >
                Dispatch Ticket
              </Button>
            </Card>

            {/* TRUST MARKERS */}
            <div className="space-y-4 px-2">
              <div className="flex items-center gap-4 text-gray-500">
                <Clock size={16} className="text-[#A37E2C]" />
                <span className="text-[9px] tracking-[0.2em] uppercase font-bold">Average response: 2 Hours</span>
              </div>
              <div className="flex items-center gap-4 text-gray-500">
                <ShieldCheck size={16} className="text-[#A37E2C]" />
                <span className="text-[9px] tracking-[0.2em] uppercase font-bold">End-to-End Encryption</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}