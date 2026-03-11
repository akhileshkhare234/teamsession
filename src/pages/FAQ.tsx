import React from "react";
import "./FAQ.css";

const FAQ = () => {
  const faqs = [
    {
      question: "What is Team Session Manager?",
      answer: "Team Session Manager is an all-in-one platform for tracking employee sessions, expenditures, and generating comprehensive reports for your organization. It helps streamline team management and administrative tasks."
    },
    {
      question: "How do I get started?",
      answer: "Getting started is easy! Simply click the 'Register now' button, fill in your company details, and you'll be ready to start managing your team sessions within minutes."
    },
    {
      question: "What features are included?",
      answer: "Our platform includes session tracking, detailed analytics, secure reporting, expenditure management, employee management, automated notifications, and comprehensive reporting tools."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, absolutely. We use industry-standard encryption and security protocols to protect your data. All information is stored securely and we comply with data protection regulations."
    },
    {
      question: "Can I integrate with other tools?",
      answer: "Yes, Enterprise accounts are designed to leverage APIs for integration with other tools and systems. Contact us to learn more about our integration capabilities."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We offer email support for all users. Enterprise customers also have access to priority support and dedicated account managers. You can reach us at support@teamsession.com."
    },
    {
      question: "How much does it cost?",
      answer: "We offer flexible pricing plans based on your organization's size and needs. Contact us for a customized quote or visit our pricing page for more details."
    },
    {
      question: "Can I try it before purchasing?",
      answer: "Yes! We offer a free trial period so you can explore all features and see how Team Session Manager fits your organization's needs."
    }
  ];

  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h1 className="faq-title">Frequently Asked Questions</h1>
        <p className="faq-subtitle">
          Find answers to common questions about Team Session Manager. Can't find what you're looking for? Contact us!
        </p>
      </div>

      <div className="faq-content">
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className={`faq-question ${openIndex === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <svg
                  className={`faq-icon ${openIndex === index ? 'rotate' : ''}`}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 8l4 4 4-4" />
                </svg>
              </button>
              <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="faq-cta">
        <h2>Still have questions?</h2>
        <p>Our team is here to help. Get in touch with us!</p>
        <a href="/contact" className="faq-contact-button">Contact Us</a>
      </div>
    </div>
  );
};

export default FAQ;
