import { Phone, Mail } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ContactUs = () => {
  const contactItems = [
    {
      icon: Phone,
      text: '+263 777 979 235',
    },
    {
      icon: Mail,
      text: 'nyamandiashley@gmail.com',
      href: 'mailto:hello@reallygreatsite.com',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Nymd: Contact Us</title>
      </Helmet>    
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6 py-12">
        {/* Subtle diagonal texture overlay */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #5C4033 0, #5C4033 1px, transparent 1px, transparent 60px)',
          }}
        />

        <div className="relative w-full max-w-md flex flex-col items-center">
          {/* Logo */}
          <div className="mb-3">
            <LotusLogo />
          </div>

          {/* Brand Name */}
          <p className="text-[#5C4033] text-lg font-medium tracking-wide mb-8">
            Nymd Online School
          </p>

          {/* Heading */}
          <h1
            className="text-[#5C4033] text-6xl md:text-7xl font-normal text-center mb-12 leading-none"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Contact Us
          </h1>

          {/* Contact Items */}
          <div className="w-full space-y-4">
            {contactItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex flex-col items-center">
                  {/* Icon Circle */}
                  <div className="bg-[#5C4033] rounded-full p-2 mb-3">
                    <Icon className="w-4 h-4 text-[#FAF7F2]" strokeWidth={2.5} />
                  </div>

                  {/* Pill Button */}
                  <span
                    className="w-full max-w-85 border border-[#5C4033]/60 rounded-full px-6 py-3 text-center text-[#5C4033] text-lg hover:bg-[#5C4033] hover:text-[#FAF7F2] transition-all duration-300"
                  >
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

/* Simple lotus logo drawn with SVG to match the reference */
const LotusLogo = () => (
  <svg
    width="72"
    height="72"
    viewBox="0 0 72 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#5C4033]"
  >
    <g stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" fill="none">
      {/* Center petal */}
      <path d="M36 14 C 32 24, 32 34, 36 44 C 40 34, 40 24, 36 14 Z" />
      {/* Inner left petal */}
      <path d="M36 44 C 28 40, 24 32, 24 22 C 31 26, 35 34, 36 44 Z" />
      {/* Inner right petal */}
      <path d="M36 44 C 44 40, 48 32, 48 22 C 41 26, 37 34, 36 44 Z" />
      {/* Outer left petal */}
      <path d="M36 44 C 26 44, 18 40, 14 32 C 23 32, 32 37, 36 44 Z" />
      {/* Outer right petal */}
      <path d="M36 44 C 46 44, 54 40, 58 32 C 49 32, 40 37, 36 44 Z" />
    </g>
  </svg>
);

export default ContactUs;