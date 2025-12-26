// pages/about.tsx or app/about/page.tsx

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
}

const AboutPage: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'John Doe',
      role: 'CEO & Founder',
      bio: 'John has over 10 years of experience in the industry.',
      image: '/images/a3.webp'
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'CTO',
      bio: 'Jane leads our technical team with expertise in modern web technologies.',
      image: '/images/a3.webp'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'Lead Designer',
      bio: 'Mike creates beautiful and functional user experiences.',
      image: '/images/a3.webp'
    }
  ];

  const stats = [
    { number: '5+', label: 'Years Experience' },
    { number: '100+', label: 'Projects Completed' },
    { number: '50+', label: 'Happy Clients' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <>
      <Head>
        <title>About Us - BookStore</title>
        <meta name="description" content="Learn more about BookStore, our mission, and team" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-50 to-amber-100 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-6">
                About BookStore
              </h1>
              <p className="text-xl text-amber-800/80 mb-8">
                We are passionate about bringing the joy of reading to book lovers everywhere.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-amber-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-4">
                  Our mission is to make quality books accessible to everyone while providing 
                  an exceptional reading experience. We believe in the power of stories to 
                  transform lives and connect people across generations.
                </p>
                <p className="text-lg text-gray-700">
                  We curate our collection with care, ensuring every book we offer meets 
                  the highest standards of quality and provides genuine value to our readers.
                </p>
              </div>
              <div className="relative h-80 rounded-lg overflow-hidden shadow-lg border border-amber-200">
                <Image
                  src="/images/a3.webp"
                  alt="Our Book Collection"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-amber-50 to-amber-100/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-700 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-700">
                The passionate bibliophiles behind BookStore
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div 
                  key={member.id} 
                  className="bg-white rounded-lg shadow-lg p-6 text-center border border-amber-100 hover:shadow-xl transition-shadow duration-300 hover:border-amber-300"
                >
                  <div className="w-32 h-32 mx-auto mb-4 relative rounded-full overflow-hidden border-4 border-amber-200">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-amber-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-amber-700 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-700">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gradient-to-br from-amber-50 to-amber-100/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">Our Values</h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                The principles that guide everything we do at BookStore
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md border border-amber-200">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-4">Quality First</h3>
                <p className="text-gray-700">
                  We carefully select every book to ensure it meets our high standards of content and production quality.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md border border-amber-200">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-4">Community Focus</h3>
                <p className="text-gray-700">
                  We believe in building a community of readers who share their love for books and learning.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md border border-amber-200">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-4">Fast Delivery</h3>
                <p className="text-gray-700">
                  We ensure quick and reliable delivery so you can start reading your new books as soon as possible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-amber-900 to-amber-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Reading Journey?
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied readers who have found their perfect books with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/products"
                className="bg-white text-amber-900 px-8 py-3 rounded-lg hover:bg-amber-100 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Browse Books
              </Link>
              <Link 
                href="/contact"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-amber-900 font-semibold transition-all duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;