"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const faqs = [
  {
    question: "How can I track my order?",
    answer:
      "Go to 'My Orders' in your profile. Click on the order to see detailed status and tracking information.",
  },
  {
    question: "How do I cancel an order?",
    answer:
      "You can cancel your order only if it's not yet processed. Go to 'My Orders' and click 'Cancel' if available.",
  },
  {
    question: "How do I change my password?",
    answer:
      "Go to 'Settings' in your profile and select 'Change Password' to update your account password.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can raise a ticket from this Help Center, or send an email to support@yourdomain.com.",
  },
];

export default function HelpCenter() {
  const [openIndex, setOpenIndex] = useState(null);
  const [message, setMessage] = useState("");

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const submitTicket = () => {
    if (!message.trim()) return toast.error("Please enter a message");
    toast.success("Support ticket submitted!");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Help Center</h2>

      {/* FAQs */}
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <Card
            key={index}
            className="p-4 cursor-pointer bg-gray-800 hover:bg-gray-700 transition"
            onClick={() => toggleFaq(index)}
          >
            <div className="flex justify-between items-center">
              <p className="text-white font-medium">{faq.question}</p>
              <span className="text-green-400">
                {openIndex === index ? "-" : "+"}
              </span>
            </div>
            {openIndex === index && (
              <p className="text-gray-300 mt-2">{faq.answer}</p>
            )}
          </Card>
        ))}
      </div>

      {/* Support Ticket Form */}
      <Card className="p-4 bg-gray-800">
        <h3 className="text-lg font-semibold text-white mb-2">Submit a Ticket</h3>
        <textarea
          className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={4}
          placeholder="Describe your issue here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          className="mt-2 bg-green-500 hover:bg-green-600 text-white"
          onClick={submitTicket}
        >
          Submit
        </Button>
      </Card>
    </div>
  );
}
