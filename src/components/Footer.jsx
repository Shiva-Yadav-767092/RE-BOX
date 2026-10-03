import React from 'react';
import { Leaf, ArrowRight, Heart } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="border-t border-charcoal-border bg-background-warm/60 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-accent text-white flex items-center justify-center font-mono font-bold text-xs">
                RE:
              </div>
              <span className="font-bold text-lg text-charcoal tracking-tight">RE:BOX</span>
            </div>
            <p className="text-sm text-charcoal-muted max-w-sm leading-relaxed">
              An object doesn't become useless just because its first purpose is over. 
              RE:BOX helps people discover what everyday unwanted objects can become through creative reuse.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-accent font-medium">
              <Leaf className="w-3.5 h-3.5" />
              <span>Diverting everyday waste into purposeful utility</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-charcoal-muted">
              <li>
                <button onClick={() => setActivePage('workspace')} className="hover:text-charcoal transition-colors">
                  Start with an Object
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('explore')} className="hover:text-charcoal transition-colors">
                  Material Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('projects')} className="hover:text-charcoal transition-colors">
                  My Saved Projects
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('about')} className="hover:text-charcoal transition-colors">
                  Our Philosophy
                </button>
              </li>
            </ul>
          </div>

          {/* Core Journey */}
          <div>
            <h4 className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-3">
              The Journey
            </h4>
            <div className="flex flex-col space-y-1.5 text-xs text-charcoal-muted font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-charcoal-subtle"></span>
                OLD OBJECT
              </span>
              <span className="text-charcoal-subtle pl-3">↓</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                IDEAS & VISUALIZE
              </span>
              <span className="text-charcoal-subtle pl-3">↓</span>
              <span className="flex items-center gap-1.5 font-semibold text-accent-dark">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                NEW PRODUCT
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-charcoal-borderLight mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-subtle">
          <p>
            © {new Date().getFullYear()} RE:BOX. Built with intentional craft.
          </p>
          <p className="flex items-center gap-1">
            Give Old Things a New Identity.
          </p>
        </div>

      </div>
    </footer>
  );
}
