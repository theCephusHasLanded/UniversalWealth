import React from 'react';

interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
  image?: string;
  className?: string;
}

const Testimonial: React.FC<TestimonialProps> = ({
  quote,
  name,
  title,
  image,
  className = '',
}) => {
  return (
    <div className={`p-6 md:p-8 bg-navy-600 bg-opacity-90 backdrop-blur-sm border-l-2 border-gold relative ${className}`}>
      {/* Quote mark */}
      <div className="absolute top-4 left-6 text-gold text-opacity-20 text-6xl font-serif leading-none">
        "
      </div>
      
      <div className="relative">
        <p className="text-neutral-200 text-lg mb-6 italic font-serif leading-relaxed">
          "{quote}"
        </p>
        
        <div className="flex items-center">
          {image && (
            <div className="mr-4 w-12 h-12 rounded-full overflow-hidden">
              <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div>
            <h4 className="text-gold font-medium text-sm">{name}</h4>
            <p className="text-neutral-400 text-xs uppercase tracking-wider">{title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;