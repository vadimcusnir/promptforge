'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const packageName = searchParams.get('package');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    plan: plan || '',
    package: packageName || '',
    message: '',
    teamSize: '',
    useCase: '',
    timeline: '',
    budget: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (plan) {
      setFormData(prev => ({ ...prev, plan }));
    }
    if (packageName) {
      setFormData(prev => ({ ...prev, package: packageName }));
    }
  }, [plan, packageName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        phone: '',
        plan: '',
        package: '',
        message: '',
        teamSize: '',
        useCase: '',
        timeline: '',
        budget: '',
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getDefaultMessage = () => {
    if (plan === 'enterprise') {
      return "II'mapos;m interested in learning more about the Enterprise plan for our organization. We're looking for a comprehensive solution with custom modules, white-label options, and dedicated support.";
    }

    if (packageName) {
      const packageInfo = {
        'fintech-pack':
          "I'm interested in the FinTech Industry Pack for compliance templates, risk assessment, and regulatory frameworks.",
        'education-pack':
          "I'm interested in the Education Pack for curriculum design, assessment tools, and student engagement.",
        'healthcare-pack':
          "I'm interested in the Healthcare Pack for patient communication, medical documentation, and compliance.",
        'developer-pack':
          "I'm interested in the Developer Pack for API documentation, code generation, and technical writing.",
      };
      return (
        packageInfo[packageName as keyof typeof packageInfo] ||
        "I'm interested in learning more about this industry package."
      );
    }

    return '';
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#ECFEFF] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <CheckCircle className="w-16 h-16 text-[#16A34A] mx-auto mb-6" />
          <h1 className="text-h1 text-[#ECFEFF] mb-4">Thank You!</h1>
          <p className="text-body text-[#ECFEFF]/80 mb-8">
            We've received your inquiry and will get back to you within 24 hours.
          </p>
          <button onClick={() => setIsSubmitted(false)} className="btn">
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#ECFEFF]">
      {/* Static Grid Background */}
      <div className="grid-static"></div>

      {/* Contact Section */}
      <section className="container mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-h1 text-[#ECFEFF] mb-4">
            <span className="kw" data-glitch>
              <span className="kw__text">Contact Us</span>
              <span className="kw__glitch" aria-hidden="true"></span>
            </span>
          </h1>
          <div className="pf-yard-line mx-auto max-w-md"></div>
          <p className="text-body text-[#ECFEFF]/80 max-w-2xl mx-auto">
            {plan === 'enterprise'
              ? "Let's discuss how PROMPTFORGE™ Enterprise can transform your organization's prompt engineering capabilities."
              : packageName
                ? 'Get more information about our industry-specific packages and how they can enhance your workflow.'
                : "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="pf-block p-8">
            <span className="pf-corner tl"></span>
            <span className="pf-corner tr"></span>
            <span className="pf-corner bl"></span>
            <span className="pf-corner br"></span>

            <h2 className="text-h2 text-[#ECFEFF] mb-6">Send us a message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-[#ECFEFF]/80 mb-2"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-[#ECFEFF] focus:border-[#164E63] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-[#ECFEFF]/80 mb-2"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-[#ECFEFF] focus:border-[#164E63] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#ECFEFF]/80 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-[#ECFEFF] focus:border-[#164E63] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-[#ECFEFF]/80 mb-2"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-[#ECFEFF] focus:border-[#164E63] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-[#ECFEFF]/80 mb-2"
                >
                  Company *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-[#ECFEFF] focus:border-[#164E63] focus:outline-none transition-colors"
                />
              </div>

              {plan === 'enterprise' && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="teamSize"
                        className="block text-sm font-medium text-[#ECFEFF]/80 mb-2"
                      >
                        Team Size *
                      </label>
                      <select
                        id="teamSize"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-[#ECFEFF] focus:border-[#164E63] focus:outline-none transition-colors"
                      >
                        <option value="">Select team size</option>
                        <option value="10-50">10-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-1000">201-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="budget"
                        className="block text-sm font-medium text-[#ECFEFF]/80 mb-2"
                      >
                        Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-[#ECFEFF] focus:border-[#164E63] focus:outline-none transition-colors"
                      >
                        <option value="">Select budget range</option>
                        <option value="$5k-25k">$5k - $25k</option>
                        <option value="$25k-100k">$25k - $100k</option>
                        <option value="$100k-500k">$100k - $500k</option>
                        <option value="$500k+">$500k+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="useCase"
                      className="block text-sm font-medium text-[#ECFEFF]/80 mb-2"
                    >
                      Primary Use Case *
                    </label>
                    <select
                      id="useCase"
                      name="useCase"
                      value={formData.useCase}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-[#ECFEFF] focus:border-[#164E63] focus:outline-none transition-colors"
                    >
                      <option value="">Select primary use case</option>
                      <option value="content-creation">Content Creation</option>
                      <option value="customer-support">Customer Support</option>
                      <option value="sales-marketing">Sales & Marketing</option>
                      <option value="product-development">Product Development</option>
                      <option value="training-education">Training & Education</option>
                      <option value="compliance-legal">Compliance & Legal</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="timeline"
                      className="block text-sm font-medium text-[#ECFEFF]/80 mb-2"
                    >
                      Implementation Timeline
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-[#ECFEFF] focus:border-[#164E63] focus:outline-none transition-colors"
                    >
                      <option value="">Select timeline</option>
                      <option value="immediate">Immediate (within 30 days)</option>
                      <option value="1-3-months">1-3 months</option>
                      <option value="3-6-months">3-6 months</option>
                      <option value="6-12-months">6-12 months</option>
                      <option value="12+months">12+ months</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[#ECFEFF]/80 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder={getDefaultMessage()}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-[#ECFEFF] focus:border-[#164E63] focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-notched py-4 px-8 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="pf-block p-8">
              <span className="pf-corner tl"></span>
              <span className="pf-corner tr"></span>
              <span className="pf-corner bl"></span>
              <span className="pf-corner br"></span>

              <h3 className="text-h3 text-[#ECFEFF] mb-6">Get in touch</h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-[#164E63] mr-3" />
                  <div>
                    <p className="font-medium text-[#ECFEFF]">Email</p>
                    <p className="text-[#ECFEFF]/80">sales@promptforge.ai</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-[#164E63] mr-3" />
                  <div>
                    <p className="font-medium text-[#ECFEFF]">Phone</p>
                    <p className="text-[#ECFEFF]/80">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 text-[#164E63] mr-3" />
                  <div>
                    <p className="font-medium text-[#ECFEFF]">Live Chat</p>
                    <p className="text-[#ECFEFF]/80">Available 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            {plan === 'enterprise' && (
              <div className="pf-block p-8">
                <span className="pf-corner tl"></span>
                <span className="pf-corner tr"></span>
                <span className="pf-corner bl"></span>
                <span className="pf-corner br"></span>

                <h3 className="text-h3 text-[#ECFEFF] mb-6">Enterprise Benefits</h3>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#16A34A] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-[#ECFEFF]/90">Unlimited prompts and team seats</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#16A34A] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-[#ECFEFF]/90">Custom modules and domains</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#16A34A] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-[#ECFEFF]/90">White-label options</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#16A34A] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-[#ECFEFF]/90">SLA and dedicated support</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#16A34A] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-[#ECFEFF]/90">Custom integrations</p>
                  </div>
                </div>
              </div>
            )}

            {packageName && (
              <div className="pf-block p-8">
                <span className="pf-corner tl"></span>
                <span className="pf-corner tr"></span>
                <span className="pf-corner bl"></span>
                <span className="pf-corner br"></span>

                <h3 className="text-h3 text-[#ECFEFF] mb-6">Package Details</h3>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#16A34A] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-[#ECFEFF]/90">Specialized industry modules</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#16A34A] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-[#ECFEFF]/90">Domain-specific templates</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#16A34A] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-[#ECFEFF]/90">Compliance frameworks</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#16A34A] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-[#ECFEFF]/90">Expert consultation</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Glitch Protocol v1 Script */}
      <script defer src="/glitch-keywords.js"></script>
    </div>
  );
}
