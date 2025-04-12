import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { useTranslation } from '../contexts/TranslationContext';
import FamilyWealthTree from '../components/wealth/FamilyWealthTree';
import { FileText, Users, BarChart3, Calculator, BookOpen } from 'lucide-react';

const WealthPlanningPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('family-tree');
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">{t('wealth.planning.title')}</h1>
        <p className="text-neutral-300">{t('wealth.planning.description')}</p>
      </div>
      
      <Tabs defaultValue="family-tree" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2 mb-4 -mx-4 px-4">
          <TabsList className="bg-navy-900 border border-navy-700 rounded-sm p-1 flex-nowrap whitespace-nowrap">
            <TabsTrigger 
              value="family-tree"
              className="flex items-center px-3 py-2 data-[state=active]:bg-navy-800 data-[state=active]:text-gold rounded-sm"
            >
              <Users size={16} className="mr-2" />
              <span>{t('wealth.planning.familyTree')}</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="simulations"
              className="flex items-center px-3 py-2 data-[state=active]:bg-navy-800 data-[state=active]:text-gold rounded-sm"
            >
              <BarChart3 size={16} className="mr-2" />
              <span>{t('wealth.planning.projections')}</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="estate"
              className="flex items-center px-3 py-2 data-[state=active]:bg-navy-800 data-[state=active]:text-gold rounded-sm"
            >
              <FileText size={16} className="mr-2" />
              <span>{t('wealth.planning.estate')}</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="education"
              className="flex items-center px-3 py-2 data-[state=active]:bg-navy-800 data-[state=active]:text-gold rounded-sm"
            >
              <BookOpen size={16} className="mr-2" />
              <span>{t('wealth.planning.education')}</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="taxes"
              className="flex items-center px-3 py-2 data-[state=active]:bg-navy-800 data-[state=active]:text-gold rounded-sm"
            >
              <Calculator size={16} className="mr-2" />
              <span>{t('wealth.planning.taxes')}</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent 
          value="family-tree" 
          className="bg-navy-800 border border-navy-700 rounded-sm p-4"
        >
          <div className="mb-4">
            <h2 className="text-lg font-medium text-white mb-2">{t('wealth.tree.title')}</h2>
            <p className="text-neutral-300 text-sm mb-4">{t('wealth.tree.description')}</p>
            
            <FamilyWealthTree />
            
            <div className="mt-6 bg-navy-900 p-4 rounded-sm border border-navy-700">
              <h3 className="text-sm uppercase tracking-wider text-neutral-200 mb-2">{t('wealth.tree.recommendations')}</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-4 h-4 bg-navy-800 border border-gold flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-gold"></div>
                  </div>
                  <span className="text-sm text-neutral-300">Consider establishing a GRAT for business interests to minimize estate taxes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-4 h-4 bg-navy-800 border border-gold flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-gold"></div>
                  </div>
                  <span className="text-sm text-neutral-300">Transfer investment assets to family trust to protect against creditors</span>
                </li>
                <li className="flex items-start">
                  <div className="w-4 h-4 bg-navy-800 border border-gold flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-gold"></div>
                  </div>
                  <span className="text-sm text-neutral-300">Set up 529 plans for both children to optimize education savings</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent 
          value="simulations"
          className="bg-navy-800 border border-navy-700 rounded-sm p-4"
        >
          <div className="flex items-center justify-center h-60 border border-dashed border-navy-600 rounded-sm">
            <div className="text-center">
              <BarChart3 size={32} className="text-blue-400 mx-auto mb-2" />
              <p className="text-neutral-300">Monte Carlo Projections</p>
              <p className="text-neutral-400 text-sm">Coming soon...</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent 
          value="estate"
          className="bg-navy-800 border border-navy-700 rounded-sm p-4"
        >
          <div className="flex items-center justify-center h-60 border border-dashed border-navy-600 rounded-sm">
            <div className="text-center">
              <FileText size={32} className="text-purple-400 mx-auto mb-2" />
              <p className="text-neutral-300">Estate Planning Tools</p>
              <p className="text-neutral-400 text-sm">Coming soon...</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent 
          value="education"
          className="bg-navy-800 border border-navy-700 rounded-sm p-4"
        >
          <div className="flex items-center justify-center h-60 border border-dashed border-navy-600 rounded-sm">
            <div className="text-center">
              <BookOpen size={32} className="text-green-400 mx-auto mb-2" />
              <p className="text-neutral-300">Education Fund Optimization</p>
              <p className="text-neutral-400 text-sm">Coming soon...</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent 
          value="taxes"
          className="bg-navy-800 border border-navy-700 rounded-sm p-4"
        >
          <div className="flex items-center justify-center h-60 border border-dashed border-navy-600 rounded-sm">
            <div className="text-center">
              <Calculator size={32} className="text-red-400 mx-auto mb-2" />
              <p className="text-neutral-300">Tax Optimization</p>
              <p className="text-neutral-400 text-sm">Coming soon...</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WealthPlanningPage;