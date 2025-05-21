import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import "../FaqSection.css"; // External CSS file

const faqs = [
  {
    question: "Is it possible to use Youtube video downloader on my PC?",
    answer:
      "Of course! Tublinx works directly in your browser. Our downloader service is also available for tablets, Macs, and phones.",
  },
  {
    question: "What type of file formats does Tublinx support for downloading?",
    answer:
      " while MP4 is widely used for high-quality videos with small file sizes.",
  },
  {
    question: "Is this Youtube video downloader a free service?",
    answer:
      "Yes! Our Youtube video downloader  is completely FREE. No need for account registration or any paid service.",
  },
  {
    question: "What other devices are compatible with the Tublinx downloader?",
    answer:
      "Tublinx supports all platforms including iPads, iPhones, Android devices, and PCs. Just a web browser is required.",
  },
  {
    question: "How safe is it to download Youtube videos with Tublinx?",
    answer:
      "It is completely safe! Our safety policy ensures we do not collect users' data. We value your trust!",
  },
];

export default function FaqSection({ darkMode }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`faq-container ${darkMode ? "dark-faq-cont" : ""}`}>
      <h2 className={`faq-title ${darkMode ? "dark-faq-title" : ""}`}>Frequently Asked Questions (FAQ)</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className={`faq-item ${darkMode ? "dark-faq-item" : ""}`}>
            <button className={`faq-question ${darkMode ? "dark-faq-question" : ""}`} onClick={() => toggleFAQ(index)}>
              {faq.question}
              <FaChevronDown
                className={`faq-icon ${openIndex === index ? "rotate" : ""}`}
              />
            </button>
            <div className={`faq-answer ${openIndex === index ? "open" : ""}`}>
              <p className={`${darkMode ? "dark-faq-ans" : ""}`}>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
