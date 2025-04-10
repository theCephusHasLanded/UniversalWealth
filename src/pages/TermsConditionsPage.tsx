import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const TermsConditionsPage: React.FC = () => {
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
              <h1 className="text-lg uppercase tracking-widest text-gold font-light">Terms & Conditions</h1>
            </div>
          </div>
        </div>
      </header>
      
      {/* Content */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-10 text-center">
          <FileText size={32} className="text-gold mx-auto mb-4" />
          <h2 className="text-xl font-light text-white mb-4">LKHN Universal Wealth Membership Agreement</h2>
          <p className="text-sm text-neutral-300 max-w-2xl mx-auto">
            Please read these Terms and Conditions carefully before using the LKHN Universal Wealth platform.
            Your access to and use of the service is conditioned on your acceptance of and compliance with these Terms.
          </p>
          <div className="h-px w-16 bg-gold/30 mx-auto mt-6"></div>
        </div>
        
        <div className="space-y-10">
          {/* Section 1 */}
          <section>
            <div className="flex items-center mb-6">
              <div className="h-px w-6 bg-gold mr-3"></div>
              <h3 className="text-sm uppercase tracking-widest text-gold">Definitions</h3>
            </div>
            
            <div className="pl-6 border-l border-navy-700 space-y-4">
              <p className="text-sm text-neutral-300 leading-relaxed">
                Throughout this Agreement, the following terms shall have the meanings set forth below:
              </p>
              
              <div className="space-y-4">
                {[
                  { term: "Platform", definition: "The LKHN Universal Wealth website, mobile application, and related services." },
                  { term: "Member", definition: "An individual or entity that has registered for and been granted access to the Platform." },
                  { term: "Content", definition: "All information, data, text, software, images, graphics, or other materials that are displayed or available through the Platform." },
                  { term: "Financial Data", definition: "Information related to a Member's financial accounts, transactions, investments, and related information." },
                  { term: "Services", definition: "All features, applications, content, and other services provided by LKHN Universal Wealth." }
                ].map((item, index) => (
                  <div key={index} className="flex">
                    <div className="w-32 flex-shrink-0">
                      <span className="text-sm text-gold font-medium">{item.term}</span>
                    </div>
                    <div className="flex-grow">
                      <span className="text-sm text-neutral-300">{item.definition}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Section 2 */}
          <section>
            <div className="flex items-center mb-6">
              <div className="h-px w-6 bg-gold mr-3"></div>
              <h3 className="text-sm uppercase tracking-widest text-gold">Membership & Eligibility</h3>
            </div>
            
            <div className="pl-6 border-l border-navy-700 space-y-4">
              <div>
                <h4 className="text-sm text-white mb-2">Account Registration</h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  To access certain features of the Platform, you must register for an account. 
                  You agree to provide accurate, current, and complete information during the 
                  registration process and to update such information to keep it accurate, current, 
                  and complete. LKHN reserves the right to suspend or terminate your account if any 
                  information provided during registration or thereafter proves to be inaccurate, 
                  not current, or incomplete.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm text-white mb-2">Membership Tiers</h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  LKHN Universal Wealth offers different membership tiers, each providing access to 
                  different features and services. The specific benefits associated with each tier 
                  are described on the Platform. LKHN reserves the right to modify membership tiers, 
                  benefits, and pricing at any time.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm text-white mb-2">Eligibility Requirements</h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  You must be at least 18 years old and have the legal capacity to enter into a binding 
                  agreement to use the Services. By registering for an account, you represent and warrant 
                  that you meet all eligibility requirements. The Platform is not directed to individuals 
                  under the age of 18, and we request that such individuals do not provide any personal 
                  information to LKHN.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm text-white mb-2">Invitation-Only Features</h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Certain features of the Platform may be available on an invitation-only basis. 
                  Eligibility for such features is determined at LKHN's sole discretion. Invitations 
                  are non-transferable and must not be shared with third parties.
                </p>
              </div>
            </div>
          </section>
          
          {/* Section 3 */}
          <section>
            <div className="flex items-center mb-6">
              <div className="h-px w-6 bg-gold mr-3"></div>
              <h3 className="text-sm uppercase tracking-widest text-gold">Member Conduct & Restrictions</h3>
            </div>
            
            <div className="pl-6 border-l border-navy-700">
              <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                As a Member of LKHN Universal Wealth, you agree not to:
              </p>
              
              <div className="space-y-3 mb-6">
                {[
                  "Use the Platform for any illegal purpose or in violation of any local, state, national, or international law",
                  "Violate the rights of others, including intellectual property, privacy, or publicity rights",
                  "Impersonate any person or entity or falsely state or misrepresent your affiliation with a person or entity",
                  "Interfere with or disrupt the operation of the Platform or servers or networks connected to the Platform",
                  "Attempt to gain unauthorized access to any portion of the Platform or any other accounts, systems, or networks",
                  "Use any automated means, including bots, scrapers, or spiders, to access or use the Platform",
                  "Decompile, reverse engineer, disassemble, or otherwise attempt to derive the source code of the Platform",
                  "Engage in any activity that interferes with another Member's use and enjoyment of the Platform",
                  "Share your account credentials with any third party or allow anyone else to access your account",
                  "Use the Platform to transmit any malware, viruses, or other malicious code"
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="h-5 w-5 bg-navy-700 border border-gold flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <div className="h-1.5 w-1.5 bg-gold"></div>
                    </div>
                    <p className="text-sm text-neutral-300 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-neutral-300 leading-relaxed">
                LKHN reserves the right to investigate and take appropriate legal action against anyone who, 
                in LKHN's sole discretion, violates these provisions, including without limitation, removing 
                the offensive content, suspending or terminating the account of such violators, and reporting 
                to law enforcement authorities.
              </p>
            </div>
          </section>
          
          {/* Section 4 */}
          <section>
            <div className="flex items-center mb-6">
              <div className="h-px w-6 bg-gold mr-3"></div>
              <h3 className="text-sm uppercase tracking-widest text-gold">Fees & Payment</h3>
            </div>
            
            <div className="pl-6 border-l border-navy-700 space-y-4">
              <div>
                <h4 className="text-sm text-white mb-2">Membership Fees</h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Certain Services require payment of fees. All fees are stated in US dollars and are non-refundable 
                  except as expressly set forth in these Terms. LKHN reserves the right to change the fees for any 
                  Services at any time, provided that, for Services billed on a subscription basis, the change will 
                  become effective only at the end of the then-current billing cycle.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm text-white mb-2">Billing</h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  You will provide LKHN with valid, up-to-date credit card information or other payment method. 
                  You authorize LKHN to charge all fees to your payment method. For subscription-based Services, 
                  LKHN will bill you at the beginning of each billing cycle. If your payment method fails or your 
                  account is past due, LKHN may immediately restrict access to your account.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm text-white mb-2">Taxes</h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  All fees are exclusive of all taxes, levies, or duties imposed by taxing authorities. You are 
                  responsible for all taxes, levies, or duties associated with your use of the Services, excluding 
                  only taxes based on LKHN's net income.
                </p>
              </div>
            </div>
          </section>
          
          {/* Section 5 */}
          <section>
            <div className="flex items-center mb-6">
              <div className="h-px w-6 bg-gold mr-3"></div>
              <h3 className="text-sm uppercase tracking-widest text-gold">Intellectual Property</h3>
            </div>
            
            <div className="pl-6 border-l border-navy-700 space-y-4">
              <div>
                <h4 className="text-sm text-white mb-2">LKHN Content</h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  The Platform and its entire contents, features, and functionality (including but not limited to 
                  all information, software, text, displays, images, video, and audio, and the design, selection, 
                  and arrangement thereof), are owned by LKHN, its licensors, or other providers of such material 
                  and are protected by United States and international copyright, trademark, patent, trade secret, 
                  and other intellectual property or proprietary rights laws.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm text-white mb-2">Limited License</h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  LKHN grants you a limited, non-exclusive, non-transferable, revocable license to access and use 
                  the Platform solely for your personal, non-commercial use. This license does not include any 
                  resale or commercial use of the Platform or its contents; any collection and use of any product 
                  listings, descriptions, or prices; any derivative use of the Platform or its contents; or any use 
                  of data mining, robots, or similar data gathering and extraction tools.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm text-white mb-2">Feedback</h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  If you provide LKHN with any feedback, suggestions, ideas, or proposals regarding the Platform 
                  ("Feedback"), you hereby assign to LKHN all rights in the Feedback and agree that LKHN shall 
                  have the right to use such Feedback in any manner it deems appropriate without any obligation 
                  to you.
                </p>
              </div>
            </div>
          </section>
          
          {/* Final Sections */}
          <section className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="h-px w-6 bg-gold mr-3"></div>
                <h3 className="text-sm uppercase tracking-widest text-gold">Liability Limitations</h3>
              </div>
              
              <div className="pl-6 border-l border-navy-700 h-full">
                <p className="text-sm text-neutral-300 leading-relaxed">
                  IN NO EVENT SHALL LKHN, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, 
                  OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF 
                  OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE PLATFORM, INCLUDING ANY DIRECT, INDIRECT, 
                  SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
                </p>
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-6">
                <div className="h-px w-6 bg-gold mr-3"></div>
                <h3 className="text-sm uppercase tracking-widest text-gold">Governing Law</h3>
              </div>
              
              <div className="pl-6 border-l border-navy-700 h-full">
                <p className="text-sm text-neutral-300 leading-relaxed">
                  These Terms and your use of the Platform shall be governed by and construed in accordance with 
                  the laws of the State of New York, without giving effect to any choice or conflict of law provision 
                  or rule. Any legal suit, action, or proceeding arising out of these Terms or the Platform shall be 
                  instituted exclusively in the federal courts of the United States or the courts of the State of New York.
                </p>
              </div>
            </div>
          </section>
          
          {/* Contact Section */}
          <section>
            <div className="flex items-center mb-6">
              <div className="h-px w-6 bg-gold mr-3"></div>
              <h3 className="text-sm uppercase tracking-widest text-gold">Contact Information</h3>
            </div>
            
            <div className="pl-6 border-l border-navy-700">
              <p className="text-sm text-neutral-300 leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              
              <div className="mt-4 p-4 bg-navy-800 border-l border-gold inline-block">
                <p className="text-sm text-neutral-200">
                  LKHN Universal Wealth<br />
                  Legal Department<br />
                  123 Finance Avenue<br />
                  Suite 4500<br />
                  New York, NY 10001<br />
                  legal@lkhn.com
                </p>
              </div>
            </div>
          </section>
        </div>
        
        {/* Agreement */}
        <div className="mt-12 p-6 bg-navy-800 border border-navy-700">
          <p className="text-sm text-neutral-300 leading-relaxed text-center">
            By using the LKHN Universal Wealth platform, you acknowledge that you have read these Terms and Conditions, 
            understand them, and agree to be bound by them. If you do not agree to these Terms and Conditions, 
            you must not access or use the Platform.
          </p>
        </div>
        
        {/* Last updated */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-400">Last updated: April 9, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;