import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };
  
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Header */}
      <header className="bg-navy-800 border-b border-navy-700 py-4">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              icon={<ArrowLeft size={16} />}
              iconPosition="left"
            >
              Back
            </Button>
            <div className="ml-4">
              <h1 className="text-lg uppercase tracking-widest text-gold font-light">Privacy Policy</h1>
            </div>
          </div>
        </div>
      </header>
      
      {/* Content */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-10 text-center">
          <Shield size={32} className="text-gold mx-auto mb-4" />
          <h2 className="text-xl font-light text-white mb-4">Your Privacy is Our Priority</h2>
          <p className="text-sm text-neutral-300 max-w-2xl mx-auto">
            LKHN Universal Wealth is committed to protecting your privacy and ensuring 
            the security of your personal information. This Privacy Policy outlines how we 
            collect, use, disclose, and safeguard your data.
          </p>
          <div className="h-px w-16 bg-gold/30 mx-auto mt-6"></div>
        </div>
        
        <div className="space-y-10">
          {/* Section 1 */}
          <section>
            <div className="flex items-center mb-6">
              <div className="h-px w-6 bg-gold mr-3"></div>
              <h3 className="text-sm uppercase tracking-widest text-gold">Information We Collect</h3>
            </div>
            
            <div className="pl-6 border-l border-navy-700 space-y-4">
              <div>
                <h4 className="text-sm text-white mb-2">Personal Information</h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  We collect personal information that you voluntarily provide to us when you register 
                  for LKHN Universal Wealth, express interest in obtaining information about us or our 
                  products, participate in activities on the platform, or otherwise contact us.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm text-white mb-2">Financial Information</h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  As a wealth management platform, we collect financial information necessary to provide 
                  our services, including but not limited to investment preferences, portfolio data, 
                  transaction history, and credit information. This information is handled with the 
                  utmost confidentiality and security.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm text-white mb-2">Usage Data</h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  We automatically collect certain information when you visit, use, or navigate our 
                  platform. This information does not reveal your specific identity but may include 
                  device and usage information, such as your IP address, browser and device characteristics, 
                  operating system, language preferences, referring URLs, device name, country, location, 
                  and information about how and when you use our platform.
                </p>
              </div>
            </div>
          </section>
          
          {/* Section 2 */}
          <section>
            <div className="flex items-center mb-6">
              <div className="h-px w-6 bg-gold mr-3"></div>
              <h3 className="text-sm uppercase tracking-widest text-gold">How We Use Your Information</h3>
            </div>
            
            <div className="pl-6 border-l border-navy-700 space-y-4">
              <p className="text-sm text-neutral-300 leading-relaxed">
                We use the information we collect or receive:
              </p>
              
              <ul className="space-y-3">
                {[
                  "To facilitate account creation and authentication process",
                  "To provide and maintain our exclusive wealth management services",
                  "To deliver personalized financial insights and investment opportunities",
                  "To communicate with you about updates, security alerts, and important notices",
                  "To process your financial transactions and maintain records",
                  "To detect and prevent fraud, unauthorized access, and other harmful activity",
                  "To comply with legal obligations and financial regulations",
                  "To analyze and improve our platform's performance and user experience"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-5 w-5 bg-navy-700 border border-gold flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <div className="h-1.5 w-1.5 bg-gold"></div>
                    </div>
                    <span className="text-sm text-neutral-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          
          {/* Section 3 */}
          <section>
            <div className="flex items-center mb-6">
              <div className="h-px w-6 bg-gold mr-3"></div>
              <h3 className="text-sm uppercase tracking-widest text-gold">Sharing Your Information</h3>
            </div>
            
            <div className="pl-6 border-l border-navy-700">
              <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                We may share your information with:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-navy-800 p-4 border-l border-gold/50">
                  <h4 className="text-sm text-white mb-2">Trusted Third Parties</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Service providers who help us deliver our platform and financial services, 
                    subject to strict confidentiality agreements.
                  </p>
                </div>
                
                <div className="bg-navy-800 p-4 border-l border-gold/50">
                  <h4 className="text-sm text-white mb-2">Business Partners</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Trusted financial institutions and partners that help us offer joint products 
                    and services, with your consent.
                  </p>
                </div>
                
                <div className="bg-navy-800 p-4 border-l border-gold/50">
                  <h4 className="text-sm text-white mb-2">Legal Requirements</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    When required by law, legal process, or government authorities, in compliance 
                    with financial regulations.
                  </p>
                </div>
                
                <div className="bg-navy-800 p-4 border-l border-gold/50">
                  <h4 className="text-sm text-white mb-2">Corporate Transactions</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    In connection with a corporate merger, consolidation, restructuring, sale, or other 
                    corporate change, subject to strict confidentiality.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Section 4 */}
          <section>
            <div className="flex items-center mb-6">
              <div className="h-px w-6 bg-gold mr-3"></div>
              <h3 className="text-sm uppercase tracking-widest text-gold">Your Privacy Rights</h3>
            </div>
            
            <div className="pl-6 border-l border-navy-700">
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                As a LKHN Universal Wealth member, you have certain rights regarding your personal information:
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[
                  {
                    title: "Access",
                    desc: "You can request access to the personal information we collect about you."
                  },
                  {
                    title: "Correction",
                    desc: "You can request that we correct inaccurate or incomplete information."
                  },
                  {
                    title: "Deletion",
                    desc: "You can request deletion of your personal information, subject to exceptions."
                  },
                  {
                    title: "Portability",
                    desc: "You can request a copy of your data in a structured, machine-readable format."
                  },
                  {
                    title: "Restriction",
                    desc: "You can request that we restrict the processing of your information."
                  },
                  {
                    title: "Objection",
                    desc: "You can object to our processing of your information for certain purposes."
                  }
                ].map((right, index) => (
                  <div key={index} className="p-3 bg-navy-800">
                    <h4 className="text-gold text-xs uppercase tracking-wider mb-2">{right.title}</h4>
                    <p className="text-xs text-neutral-300">{right.desc}</p>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-neutral-300 leading-relaxed">
                To exercise these rights, please contact our Privacy Officer at privacy@lkhn.com. 
                We will respond to your request within 30 days.
              </p>
            </div>
          </section>
          
          {/* Section 5 */}
          <section>
            <div className="flex items-center mb-6">
              <div className="h-px w-6 bg-gold mr-3"></div>
              <h3 className="text-sm uppercase tracking-widest text-gold">Security Measures</h3>
            </div>
            
            <div className="pl-6 border-l border-navy-700">
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                We implement strict security measures to protect your personal information from unauthorized 
                access, disclosure, alteration, and destruction. These include:
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex">
                  <div className="h-8 w-8 bg-navy-800 border border-gold/30 flex-shrink-0 flex items-center justify-center mr-3">
                    <span className="text-gold text-xs">01</span>
                  </div>
                  <div>
                    <h4 className="text-sm text-white mb-1">End-to-End Encryption</h4>
                    <p className="text-xs text-neutral-300">Advanced encryption for all data in transit and at rest</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="h-8 w-8 bg-navy-800 border border-gold/30 flex-shrink-0 flex items-center justify-center mr-3">
                    <span className="text-gold text-xs">02</span>
                  </div>
                  <div>
                    <h4 className="text-sm text-white mb-1">Multi-Factor Authentication</h4>
                    <p className="text-xs text-neutral-300">Advanced identity verification for all accounts</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="h-8 w-8 bg-navy-800 border border-gold/30 flex-shrink-0 flex items-center justify-center mr-3">
                    <span className="text-gold text-xs">03</span>
                  </div>
                  <div>
                    <h4 className="text-sm text-white mb-1">Continuous Monitoring</h4>
                    <p className="text-xs text-neutral-300">24/7 surveillance of our systems for suspicious activity</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="h-8 w-8 bg-navy-800 border border-gold/30 flex-shrink-0 flex items-center justify-center mr-3">
                    <span className="text-gold text-xs">04</span>
                  </div>
                  <div>
                    <h4 className="text-sm text-white mb-1">Regular Audits</h4>
                    <p className="text-xs text-neutral-300">Independent security assessments of our infrastructure</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Final Section */}
          <section>
            <div className="flex items-center mb-6">
              <div className="h-px w-6 bg-gold mr-3"></div>
              <h3 className="text-sm uppercase tracking-widest text-gold">Changes & Contact Information</h3>
            </div>
            
            <div className="pl-6 border-l border-navy-700">
              <h4 className="text-sm text-white mb-2">Policy Updates</h4>
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                We may update this Privacy Policy from time to time. The updated version will be 
                indicated by an updated "Revised" date and the updated version will be effective 
                as soon as it is accessible. We encourage you to review this Privacy Policy frequently 
                to be informed of how we are protecting your information.
              </p>
              
              <h4 className="text-sm text-white mb-2">Contact Us</h4>
              <p className="text-sm text-neutral-300 leading-relaxed">
                If you have questions or comments about this policy, you may email us at 
                privacy@lkhn.com or contact us by post at:
              </p>
              
              <div className="mt-4 p-4 bg-navy-800 border-l border-gold inline-block">
                <p className="text-sm text-neutral-200">
                  LKHN Universal Wealth<br />
                  Privacy Department<br />
                  123 Finance Avenue<br />
                  Suite 4500<br />
                  New York, NY 10001
                </p>
              </div>
            </div>
          </section>
        </div>
        
        {/* Last updated */}
        <div className="mt-16 text-center">
          <p className="text-xs text-neutral-400">Last updated: April 9, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;