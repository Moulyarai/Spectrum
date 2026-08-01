import { Leaf, Sparkles, Heart } from 'lucide-react';

const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-900/80">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Leaf className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Agri<span className="text-emerald-400">Vision</span>
              </span>
            </div>
            
            <p className="text-emerald-300/80 text-sm max-w-sm leading-relaxed">
              Empowering farmers with instant AI crop disease detection, localized treatment plans, and audio voice guidance.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-800 text-xs font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Smart AI Vision Engine</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-sm text-emerald-300/80">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Home</button>
              </li>
              <li>
                <button onClick={() => onNavigate('detect')} className="hover:text-white transition-colors">Detect Disease</button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">Farmer Dashboard</button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">About AgriVision</button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Contact Support</button>
              </li>
            </ul>
          </div>

          {/* Column 3: Crop Diagnostics */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Supported Crops</h4>
            <ul className="space-y-2 text-sm text-emerald-300/80">
              <li>Tomato & Solanaceous</li>
              <li>Corn & Maize</li>
              <li>Wheat & Grains</li>
              <li>Potato Blights</li>
              <li>Apple & Fruit Orchards</li>
            </ul>
          </div>

          {/* Column 4: Contact Hotline */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Farmer Line</h4>
            <p className="text-xs text-emerald-300/70">Toll-free advisory hotline:</p>
            <p className="text-base font-bold text-emerald-400">+1 (800) 555-AGRI</p>
            <p className="text-xs text-emerald-300/70 pt-2">Email Inquiry:</p>
            <p className="text-sm font-semibold text-white">support@agrivision.ai</p>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/80">
          <p>© {new Date().getFullYear()} AgriVision. Built for modern agricultural resilience.</p>
          <p className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for smallholder farmers worldwide</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
