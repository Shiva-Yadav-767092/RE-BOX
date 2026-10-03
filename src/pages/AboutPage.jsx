import React from 'react';
import { Leaf, ArrowRight, Sparkles, ShieldCheck, Heart, Layers, Compass, HelpCircle } from 'lucide-react';

export default function AboutPage({ setActivePage }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-14">
      
      {/* Page Header & Manifesto */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-light border border-accent-border text-accent-dark text-xs font-medium">
          <Leaf className="w-3.5 h-3.5 text-accent" />
          <span>Our Purpose & Philosophy</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-charcoal tracking-tight max-w-2xl mx-auto leading-tight">
          What can this become?
        </h1>

        <p className="text-sm sm:text-base text-charcoal-muted max-w-xl mx-auto leading-relaxed">
          The story behind RE:BOX and why we believe everyday objects deserve a second identity.
        </p>
      </div>

      {/* CORE PHILOSOPHY BLOCK (SPECIFIED QUOTE) */}
      <div className="bg-background-warm border-l-4 border-accent border-y border-r border-charcoal-border rounded-r-xl p-6 sm:p-10 shadow-subtle space-y-4">
        <div className="space-y-3">
          <p className="text-lg sm:text-2xl font-medium text-charcoal leading-relaxed font-sans italic">
            “An object doesn't become useless just because its first purpose is over.
            <br className="hidden sm:inline" />
            RE:BOX helps people discover what everyday unwanted objects can become by combining creative reuse, visualization and simple making instructions.”
          </p>
          <p className="text-xs text-charcoal-subtle font-mono uppercase tracking-wider">
            — The RE:BOX Design Principle
          </p>
        </div>
      </div>

      {/* THE PROBLEM & OUR APPROACH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        <div className="bg-background-surface border border-charcoal-border rounded-xl p-6 shadow-subtle space-y-3">
          <span className="text-xs font-mono font-semibold uppercase text-charcoal-subtle tracking-wider">
            The Problem
          </span>
          <h3 className="text-xl font-bold text-charcoal">
            The Disposal Blindspot
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            People often throw away everyday objects such as plastic bottles, old T-shirts, cardboard boxes, cans, jars, and scrap materials because they no longer know what to do with them.
          </p>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            Traditional municipal recycling focuses primarily on disposal, sorting, and intensive industrial reprocessing. Much of it ends up downcycled or in landfills because local systems cannot handle complex composites.
          </p>
        </div>

        <div className="bg-background-surface border border-accent/40 rounded-xl p-6 shadow-subtle space-y-3">
          <span className="text-xs font-mono font-semibold uppercase text-accent tracking-wider">
            The Solution
          </span>
          <h3 className="text-xl font-bold text-charcoal">
            Creative Reuse (Upcycling)
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            RE:BOX shifts focus from disposal to <strong className="text-charcoal">creative utility</strong>. We leverage the inherent physical properties of household materials — the waterproof fluting of a PET bottle, the tensile strength of woven cotton, the scoreable rigidity of corrugated cardboard.
          </p>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            By showing people <em className="text-accent-dark font-medium not-italic">what an object could look like</em> before cutting, we eliminate the hesitation that causes items to be discarded.
          </p>
        </div>

      </div>

      {/* THE 6-STAGE HUMAN DESIGN JOURNEY */}
      <div className="bg-background-surface border border-charcoal-border rounded-xl p-6 sm:p-8 shadow-card space-y-6">
        <div>
          <span className="text-xs font-mono font-semibold uppercase text-accent tracking-wider">
            Framework
          </span>
          <h3 className="text-2xl font-bold text-charcoal mt-1">
            The RE:BOX Transformation Journey
          </h3>
          <p className="text-xs text-charcoal-muted mt-1">
            How we guide anyone from unwanted trash to a functional household product.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 rounded-lg bg-background-warm border border-charcoal-borderLight space-y-1.5">
            <span className="font-mono font-bold text-accent">01. CAPTURE</span>
            <h4 className="font-bold text-charcoal">Everyday Object</h4>
            <p className="text-charcoal-muted">
              Input a photograph or quick description of whatever you were about to discard.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-background-warm border border-charcoal-borderLight space-y-1.5">
            <span className="font-mono font-bold text-accent">02. UNDERSTAND</span>
            <h4 className="font-bold text-charcoal">Material Analysis</h4>
            <p className="text-charcoal-muted">
              We determine material safety, structural flexibility, and environmental impact.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-background-warm border border-charcoal-borderLight space-y-1.5">
            <span className="font-mono font-bold text-accent">03. IDEAS</span>
            <h4 className="font-bold text-charcoal">Practical Possibilities</h4>
            <p className="text-charcoal-muted">
              Curated, human-tested designs that are realistic to build at home without heavy machinery.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-background-warm border border-charcoal-borderLight space-y-1.5">
            <span className="font-mono font-bold text-accent">04. VISUALIZE</span>
            <h4 className="font-bold text-charcoal">Design Transformation</h4>
            <p className="text-charcoal-muted">
              See the direct before-and-after concept rendered side-by-side to spark confidence.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-background-warm border border-charcoal-borderLight space-y-1.5">
            <span className="font-mono font-bold text-accent">05. MAKE</span>
            <h4 className="font-bold text-charcoal">Numbered Guide</h4>
            <p className="text-charcoal-muted">
              Checklists, safety warnings, and bite-sized steps that anyone can follow in 30 minutes.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-background-warm border border-charcoal-borderLight space-y-1.5">
            <span className="font-mono font-bold text-accent">06. NEW PRODUCT</span>
            <h4 className="font-bold text-charcoal">Useful Identity</h4>
            <p className="text-charcoal-muted">
              A durable, prideful item that remains in use rather than deteriorating in landfill.
            </p>
          </div>

        </div>
      </div>

      {/* MATERIAL SAFETY & RESPONSIBLE CRAFT */}
      <div className="bg-background-warm rounded-xl p-6 sm:p-8 border border-charcoal-border space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <h3 className="font-bold text-lg text-charcoal">
            Responsible Craft & Safety First
          </h3>
        </div>
        
        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
          Not all household items can be safely upcycled without precautions. RE:BOX incorporates real material safety guidelines:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-charcoal-borderLight space-y-1">
            <strong className="text-charcoal">Thermoplastics & Heat:</strong>
            <p className="text-charcoal-muted">
              Never use incandescent bulbs or heat sources with PET/HDPE plastics. Only cool 5V LED components are approved.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-charcoal-borderLight space-y-1">
            <strong className="text-charcoal">Clean Edges:</strong>
            <p className="text-charcoal-muted">
              Cut plastics and metals must be deburred using fine emery cloth, sandpaper, or edge binding with cloth tape.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-charcoal-borderLight space-y-1">
            <strong className="text-charcoal">Food & Herb Safety:</strong>
            <p className="text-charcoal-muted">
              For planters or edible storage, ensure base containers were originally food-grade and thoroughly sanitized.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-charcoal-borderLight space-y-1">
            <strong className="text-charcoal">Structural Integrity:</strong>
            <p className="text-charcoal-muted">
              Corrugated cardboard is laminated or notched with comb joints to maximize compressive load without sagging.
            </p>
          </div>
        </div>
      </div>

      {/* FINAL CALL TO ACTION */}
      <div className="text-center space-y-4 pt-4">
        <h3 className="text-2xl font-bold text-charcoal">
          Have an item on your desk or in your bin?
        </h3>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          Give it a few minutes before letting it go.
        </p>
        <button
          onClick={() => setActivePage('workspace')}
          className="px-6 py-3 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-md shadow-subtle inline-flex items-center gap-2"
        >
          <span>Give an Object New Life</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
