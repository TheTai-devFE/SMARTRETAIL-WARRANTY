import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import HeroSection from '../components/Policy/HeroSection';
import PolicyAccordion from '../components/Policy/PolicyAccordion';
import SupportSection from '../components/Policy/SupportSection';
import WarrantyTabs from '../components/Policy/WarrantyTabs';
import { warrantyPolicyData as data } from '../data/warrantyPolicyData';

const PolicyPage = () => {
  return (
    <div className="bg-white min-h-screen selection:bg-primary-100 selection:text-primary-900">
      <Navbar isDark={true} />

      {/* Hero */}
      <HeroSection data={data.hero} />

      {/* Main Content Sections */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <WarrantyTabs data={data.coverage} />
      </motion.div>

      <PolicyAccordion data={data.policies} />

      <SupportSection data={data.support} />

      {/* Footer Branding */}
      <footer className="py-12 bg-slate-900 text-center">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center space-y-4">
             <div className="flex items-center gap-2 font-black text-3xl tracking-tighter text-white opacity-20 filter grayscale">
              <span className="bg-white text-slate-900 px-2 py-0.5 rounded-lg">S</span>
              SMARTRETAIL
            </div>
            <p className="text-slate-500 text-sm font-medium">© 2024 SMARTRETAIL Warranty System. Bản quyền thuộc về SMARTRETAIL.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PolicyPage;
