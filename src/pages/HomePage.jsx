import React, { useState } from 'react';
import { ArrowRight, Sparkles, Upload, Eye, CheckCircle2, Compass, Wrench, ShieldCheck, Leaf, ArrowDown } from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';

export default function HomePage({ setActivePage, onStartWithSample }) {
  // Preselected before/after showcase pair
  const [selectedShowcaseIndex, setSelectedShowcaseIndex] = useState(0);

  const showcaseTransformations = [
    {
      title: "Plastic Bottle → Desk Lamp",
      originalObject: "1L Clear PET Bottle",
      newProduct: "Ambient Desk Lamp",
      beforeImage: "https://images.unsplash.com/photo-1598887142487-3c854d51d2c7?auto=format&fit=crop&w=800&q=80",
      afterImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
      time: "35 mins",
      difficulty: "Medium",
      materials: "Bottle, USB LED light, Wood slice base",
      sampleId: "sample_plastic_bottle"
    },
    {
      title: "T-Shirt → Tote Bag",
      originalObject: "Worn Cotton Graphic Tee",
      newProduct: "No-Sew Market Tote Bag",
      beforeImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      afterImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      time: "15 mins",
      difficulty: "Easy",
      materials: "T-shirt, Fabric shears, Ruler",
      sampleId: "sample_tshirt"
    },
    {
      title: "Cardboard Box → Organizer",
      originalObject: "Shipping Delivery Box",
      newProduct: "Desktop Compartment Organizer",
      beforeImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      afterImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      time: "40 mins",
      difficulty: "Medium",
      materials: "Box, Utility cutter, Craft glue, Kraft tape",
      sampleId: "sample_cardboard_box"
    },
    {
      title: "Tin Can → Plant Pot",
      originalObject: "Empty Food Tin Can",
      newProduct: "Rustic Herb Planter",
      beforeImage: "https://images.unsplash.com/photo-1584679109597-c656b19974c9?auto=format&fit=crop&w=800&q=80",
      afterImage: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
      time: "20 mins",
      difficulty: "Easy",
      materials: "Can, Hammer & nail, Jute twine, Soil",
      sampleId: "sample_tin_can"
    }
  ];

  const currentShowcase = showcaseTransformations[selectedShowcaseIndex];

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="pt-8 sm:pt-14 pb-4">
        <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
          
          {/* Subtle Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light border border-accent-border text-accent-dark text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            <span>Creative Reuse Studio</span>
            <span className="text-charcoal-subtle">·</span>
            <span className="text-charcoal-muted">Give Old Things a New Identity</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal max-w-3xl mx-auto leading-[1.12]">
            What if old things aren't really useless?
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-charcoal-muted max-w-2xl mx-auto leading-relaxed">
            Turn everyday unwanted objects into useful products through creative reuse. 
            Discover practical designs, visualize transformations, and build step-by-step.
          </p>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActivePage('workspace')}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-accent hover:bg-accent-hover text-white font-medium text-sm shadow-subtle hover:shadow transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
            >
              <span>Start with an Object</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => setActivePage('explore')}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-background-surface hover:bg-background-warm border border-charcoal-border text-charcoal font-medium text-sm shadow-subtle transition-colors flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-charcoal-muted" />
              <span>Explore Ideas</span>
            </button>
          </div>

          {/* Core Journey Subtitle */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-charcoal-muted">
            <span className="font-semibold text-charcoal">OLD OBJECT</span>
            <span>→</span>
            <span className="font-semibold text-charcoal">IDEAS</span>
            <span>→</span>
            <span className="font-semibold text-charcoal">VISUALIZATION</span>
            <span>→</span>
            <span className="font-semibold text-charcoal">CHOOSE</span>
            <span>→</span>
            <span className="font-semibold text-charcoal">MAKE</span>
            <span>→</span>
            <span className="font-semibold text-accent-dark bg-accent-light px-2 py-0.5 rounded">NEW PRODUCT</span>
          </div>

        </div>
      </section>

      {/* VISUAL BEFORE/AFTER CONCEPT SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-background-surface border border-charcoal-border rounded-xl p-5 sm:p-8 shadow-card">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-3 border-b border-charcoal-borderLight">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-charcoal tracking-tight">
                See What an Object Can Become
              </h2>
              <p className="text-sm text-charcoal-muted mt-0.5">
                Drag the slider to reveal how common household waste becomes an intentional functional piece.
              </p>
            </div>
            
            {/* Quick switcher buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {showcaseTransformations.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedShowcaseIndex(idx)}
                  className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                    selectedShowcaseIndex === idx
                      ? 'bg-charcoal text-white'
                      : 'bg-background-warm text-charcoal-muted hover:text-charcoal'
                  }`}
                >
                  {item.title.split(' → ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Before/After Component */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <BeforeAfterSlider
                beforeImage={currentShowcase.beforeImage}
                afterImage={currentShowcase.afterImage}
                beforeLabel={`Original: ${currentShowcase.originalObject}`}
                afterLabel={`Identity: ${currentShowcase.newProduct}`}
                beforeSub="Everyday Household Waste"
                afterSub="Upcycled Useful Product"
                aspectRatio="aspect-[16/10]"
              />
            </div>

            {/* Spec breakdown on right */}
            <div className="lg:col-span-4 space-y-4">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-charcoal-subtle font-semibold">
                  Featured Blueprint
                </span>
                <h3 className="text-lg font-bold text-charcoal">
                  {currentShowcase.newProduct}
                </h3>
                <p className="text-xs text-charcoal-muted">
                  Transformed from {currentShowcase.originalObject}
                </p>
              </div>

              <div className="space-y-2 border-t border-b border-charcoal-borderLight py-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-muted">Estimated Build Time:</span>
                  <span className="font-semibold text-charcoal">{currentShowcase.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-muted">Difficulty:</span>
                  <span className="font-semibold text-accent-dark bg-accent-light px-2 py-0.5 rounded">
                    {currentShowcase.difficulty}
                  </span>
                </div>
                <div className="flex items-start justify-between pt-1">
                  <span className="text-charcoal-muted">Required:</span>
                  <span className="font-medium text-charcoal text-right max-w-[65%]">
                    {currentShowcase.materials}
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => onStartWithSample(currentShowcase.sampleId)}
                  className="w-full py-2.5 px-4 rounded-md bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-subtle transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Build This Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* HOW RE:BOX WORKS: CAPTURE -> DISCOVER -> VISUALIZE -> MAKE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
            How RE:BOX Works
          </h2>
          <p className="text-sm text-charcoal-muted max-w-lg mx-auto">
            A simple 4-step framework turning overlooked items into purposeful products.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* STEP 1: CAPTURE */}
          <div className="bg-background-surface border border-charcoal-border rounded-xl p-5 shadow-card hover:shadow-hover transition-shadow relative">
            <div className="w-10 h-10 rounded-lg bg-background-warm border border-charcoal-borderLight flex items-center justify-center text-charcoal mb-4">
              <Upload className="w-5 h-5 text-accent" />
            </div>
            <span className="text-[11px] font-mono font-semibold uppercase text-accent tracking-wider">
              Step 1
            </span>
            <h3 className="text-base font-bold text-charcoal mt-1 mb-2">
              Capture
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Take a photo or upload an image of your everyday item. We identify its material and structural properties.
            </p>
          </div>

          {/* STEP 2: DISCOVER */}
          <div className="bg-background-surface border border-charcoal-border rounded-xl p-5 shadow-card hover:shadow-hover transition-shadow relative">
            <div className="w-10 h-10 rounded-lg bg-background-warm border border-charcoal-borderLight flex items-center justify-center text-charcoal mb-4">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <span className="text-[11px] font-mono font-semibold uppercase text-accent tracking-wider">
              Step 2
            </span>
            <h3 className="text-base font-bold text-charcoal mt-1 mb-2">
              Discover
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Receive 3–5 practical reuse ideas tailored to the exact material, whether it's PET plastic, cotton, or cardboard.
            </p>
          </div>

          {/* STEP 3: VISUALIZE */}
          <div className="bg-background-surface border border-charcoal-border rounded-xl p-5 shadow-card hover:shadow-hover transition-shadow relative">
            <div className="w-10 h-10 rounded-lg bg-background-warm border border-charcoal-borderLight flex items-center justify-center text-charcoal mb-4">
              <Eye className="w-5 h-5 text-accent" />
            </div>
            <span className="text-[11px] font-mono font-semibold uppercase text-accent tracking-wider">
              Step 3
            </span>
            <h3 className="text-base font-bold text-charcoal mt-1 mb-2">
              Visualize
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Examine the transformation side-by-side. See your original object beside its finished concept before picking up tools.
            </p>
          </div>

          {/* STEP 4: MAKE */}
          <div className="bg-background-surface border border-charcoal-border rounded-xl p-5 shadow-card hover:shadow-hover transition-shadow relative">
            <div className="w-10 h-10 rounded-lg bg-background-warm border border-charcoal-borderLight flex items-center justify-center text-charcoal mb-4">
              <Wrench className="w-5 h-5 text-accent" />
            </div>
            <span className="text-[11px] font-mono font-semibold uppercase text-accent tracking-wider">
              Step 4
            </span>
            <h3 className="text-base font-bold text-charcoal mt-1 mb-2">
              Make
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Follow simple numbered instructions with safety notes, tool requirements, and step-by-step progress tracking.
            </p>
          </div>

        </div>

      </section>

      {/* CREATIVE REUSE VS CONVENTIONAL DISPOSAL */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-background-warm border border-charcoal-border rounded-xl p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5" />
                <span>The RE:BOX Philosophy</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight leading-snug">
                “What can this become?”
              </h2>
              <p className="text-sm text-charcoal-muted leading-relaxed">
                Conventional recycling downcycles materials into industrial pulp or pellets through energy-intensive logistics.
              </p>
              <p className="text-sm text-charcoal-muted leading-relaxed">
                <strong className="text-charcoal font-semibold">Creative Reuse</strong> preserves existing form, geometry, and tensile strength right where you are — turning everyday waste into a proud, functional product in under an hour.
              </p>
            </div>

            <div className="md:col-span-6 bg-background-surface p-5 rounded-lg border border-charcoal-borderLight shadow-subtle space-y-4">
              <h4 className="text-xs font-semibold text-charcoal uppercase tracking-wider">
                Everyday Materials We Reimagine
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-background-warm/60 border border-charcoal-borderLight flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  <span className="font-medium text-charcoal">Plastic Bottles</span>
                </div>
                <div className="p-2.5 rounded bg-background-warm/60 border border-charcoal-borderLight flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  <span className="font-medium text-charcoal">Cotton T-Shirts</span>
                </div>
                <div className="p-2.5 rounded bg-background-warm/60 border border-charcoal-borderLight flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  <span className="font-medium text-charcoal">Cardboard Boxes</span>
                </div>
                <div className="p-2.5 rounded bg-background-warm/60 border border-charcoal-borderLight flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  <span className="font-medium text-charcoal">Tins & Soda Cans</span>
                </div>
                <div className="p-2.5 rounded bg-background-warm/60 border border-charcoal-borderLight flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  <span className="font-medium text-charcoal">Glass Sauce Jars</span>
                </div>
                <div className="p-2.5 rounded bg-background-warm/60 border border-charcoal-borderLight flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  <span className="font-medium text-charcoal">Scrap Wood Timber</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setActivePage('workspace')}
                  className="text-xs text-accent hover:text-accent-hover font-semibold inline-flex items-center gap-1"
                >
                  <span>Test with your own item</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL HOMEPAGE CALL TO ACTION BANNER */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6 pt-6">
        <div className="border border-charcoal-border bg-charcoal text-white rounded-2xl p-8 sm:p-12 shadow-hover space-y-4">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto text-accent">
            <Sparkles className="w-5 h-5 text-accent-light" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white max-w-xl mx-auto leading-tight">
            “Don't just throw it away.
            <br />
            Give it a new identity.”
          </h2>

          <p className="text-charcoal-subtle text-sm max-w-md mx-auto">
            Ready to discover what your item could become? Start with a photo or describe what you have.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setActivePage('workspace')}
              className="px-6 py-3 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-semibold shadow-card transition-all inline-flex items-center gap-2 active:scale-95"
            >
              <span>Start with an Object</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
