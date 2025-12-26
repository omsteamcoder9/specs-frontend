import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/ContactInfo';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-amber-100/30 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-amber-800/80 max-w-2xl mx-auto">
            Have questions about our books or services? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <ContactInfo />
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-amber-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg p-6 shadow-sm border border-amber-100 hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="font-semibold text-amber-900 mb-2">{item.question}</h3>
                <p className="text-gray-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl p-8 border border-amber-200">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">
              Need Immediate Assistance?
            </h3>
            <p className="text-amber-800/80 mb-6">
              Our support team is available to help you with any book-related queries or order issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+1234567890" 
                className="bg-gradient-to-r from-amber-700 to-amber-600 text-white px-6 py-3 rounded-lg hover:from-amber-800 hover:to-amber-700 transition-all duration-200 font-medium inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
              <a 
                href="mailto:support@bookstore.com" 
                className="border border-amber-700 text-amber-700 px-6 py-3 rounded-lg hover:bg-gradient-to-r hover:from-amber-700 hover:to-amber-600 hover:text-white transition-all duration-200 font-medium inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const faqItems = [
  {
    question: "How soon can I expect a response?",
    answer: "We typically respond to all inquiries within 24 hours during business days."
  },
  {
    question: "Do you offer phone support?",
    answer: "Yes, we offer phone support during our business hours for urgent book-related matters and order issues."
  },
  {
    question: "What is your return policy for books?",
    answer: "Books can be returned within 30 days of purchase if they're in original condition. Please contact us for a return authorization."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email. You can also track it from your account dashboard."
  },
  {
    question: "Do you offer gift wrapping?",
    answer: "Yes! We offer complimentary gift wrapping and gift messages for all orders. Just mention it in your order notes."
  }
];