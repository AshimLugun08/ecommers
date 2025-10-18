import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const { toast } = useToast();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('https://formspree.io/f/xldpgwad', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      }),
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: 'Message sent!',
            description:
              "Your query has been sent successfully. We'll get back to you soon.",
          });
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
          });
        } else {
          toast({
            title: 'Error',
            description:
              'There was a problem sending your message. Please try again later.',
          });
        }
      })
      .catch(() => {
        toast({
          title: 'Error',
          description:
            'There was a problem sending your message. Please try again later.',
        });
      });
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <div className='bg-gradient-to-r from-purple-50 to-pink-50 py-20'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-4xl md:text-6xl font-serif text-gray-800 mb-6'>
            Contact Us
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            We'd love to hear from you. Send us a message and we'll respond as
            soon as possible.
          </p>
        </div>
      </div>

      <div className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='grid lg:grid-cols-2 gap-12'>
            {/* Contact Information */}
            {/*
              To customize your contact details:
              - Update the address, phone, and email below
              - Add/remove contact methods as needed
            */}
            <div>
              <h2 className='text-3xl font-serif text-gray-800 mb-8'>
                Get in Touch
              </h2>
              <div className='space-y-8'>
                {/* Address */}
                <div className='flex items-start space-x-4'>
                  <div className='bg-purple-100 p-3 rounded-lg'>
                    <MapPin size={24} className='text-purple-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-800 mb-2'>
                      Visit Our Showroom
                    </h3>
                    <p className='text-gray-600 leading-relaxed'>
                      Chitardih road
                      <br />
                      near Yamaha showroom jamua ,<br />
                      Giridih, Jharkhand,
                      <br />
                      India
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className='flex items-start space-x-4'>
                  <div className='bg-purple-100 p-3 rounded-lg'>
                    <Phone size={24} className='text-purple-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-800 mb-2'>
                      Call Us
                    </h3>
                    <p className='text-gray-600'>+91 88868 98383</p>
                    <p className='text-gray-600'>+91 9572382826</p>
                  </div>
                </div>

                {/* Email */}
                <div className='flex items-start space-x-4'>
                  <div className='bg-purple-100 p-3 rounded-lg'>
                    <Mail size={24} className='text-purple-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-800 mb-2'>
                      Email Us
                    </h3>
                    <p className='text-gray-600'>iraxa.fashion@gmail.com</p>
                  </div>
                </div>

                {/* Hours */}
                <div className='flex items-start space-x-4'>
                  <div className='bg-purple-100 p-3 rounded-lg'>
                    <Clock size={24} className='text-purple-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-800 mb-2'>
                      Business Hours
                    </h3>
                    <div className='text-gray-600 space-y-1'>
                      <p>Monday - Friday: 10:00 AM - 8:00 PM</p>
                      <p>Saturday: 10:00 AM - 6:00 PM</p>
                      <p>Sunday: 12:00 PM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className='mt-8'>
                <div className='bg-gray-200 rounded-lg h-64 flex items-center justify-center'>
                  <iframe
                    src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1817.2206851098445!2d86.15024620650796!3d24.36594473784511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f3e513cc8cf209%3A0xb2510c88a5bf3a63!2sIRAXA%20FASHION%20MART!5e0!3m2!1sen!2sin!4v1758992930297!5m2!1sen!2sin'
                    width='100%'
                    height='100%'
                    style={{ border: 0 }}
                    allowFullScreen=''
                    loading='lazy'
                    referrerPolicy='no-referrer-when-downgrade'
                    title='Google Map Location'
                  ></iframe>
                </div>
                {/* Want to be Featured Section */}
                <div className='mt-6 text-center'>
                  <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                    Want to be Featured?
                  </h3>
                  <p className='text-gray-600 mb-2'>
                    Follow us and tag{' '}
                    <span className='font-bold'>@iraxa_fashion</span> on
                    Instagram for a chance to be featured!
                  </p>
                  <a
                    href='https://www.instagram.com/iraxa_fashion/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-block px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition-colors font-semibold'
                  >
                    iraxa fashion
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className='bg-gray-50 p-8 rounded-lg'>
                <h2 className='text-3xl font-serif text-gray-800 mb-8'>
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div>
                      <label
                        htmlFor='name'
                        className='block text-sm font-medium text-gray-700 mb-2'
                      >
                        Your Name *
                      </label>
                      <Input
                        type='text'
                        id='name'
                        name='name'
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder='Enter your full name'
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='email'
                        className='block text-sm font-medium text-gray-700 mb-2'
                      >
                        Email Address *
                      </label>
                      <Input
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder='Enter your email'
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='subject'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Subject *
                    </label>
                    <Input
                      type='text'
                      id='subject'
                      name='subject'
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder='What is this regarding?'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='message'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Message *
                    </label>
                    <Textarea
                      id='message'
                      name='message'
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder='Tell us more about your inquiry...'
                      rows={6}
                    />
                  </div>

                  <Button
                    type='submit'
                    className='w-full bg-purple-600 hover:bg-purple-700'
                  >
                    <Send size={20} className='mr-2' />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className='bg-gray-50 py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-serif text-gray-800 mb-4'>
              Frequently Asked Questions
            </h2>
            <p className='text-gray-600'>Quick answers to common questions</p>
          </div>

          <div className='max-w-3xl mx-auto space-y-6'>
            {[
              {
                question: 'What is your return policy?',
                answer:
                  'We offer a 30-day return policy for all unworn items with tags attached. Custom-made pieces are non-returnable unless defective.',
              },
              {
                question: 'How long does shipping take?',
                answer:
                  'Standard shipping takes 3-5 business days within India. Express shipping is available for 1-2 business days delivery.',
              },
              {
                question: 'Do you offer international shipping?',
                answer:
                  'Currently, we ship within India only. International shipping will be available soon.',
              },
              {
                question: 'Can I schedule a fitting appointment?',
                answer:
                  'Yes! You can schedule a personal styling and fitting appointment at our Mumbai showroom. Contact us to book your slot.',
              },
              {
                question: 'Do you offer custom sizing?',
                answer:
                  'Absolutely! Most of our pieces can be made to custom measurements. Additional charges may apply for extensive alterations.',
              },
            ].map((faq, index) => (
              <div key={index} className='bg-white p-6 rounded-lg shadow-sm'>
                <h3 className='font-semibold text-gray-800 mb-3'>
                  {faq.question}
                </h3>
                <p className='text-gray-600'>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
