'use client';
import { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Layers3,
  MousePointer2,
  Play,
} from 'lucide-react';
import ProductCard from '../frontend/components/ProductCard';
import { categories, products } from '../frontend/data/products';
export default function Home() {
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Featured');
  const shown = useMemo(() => {
    let rows =
      category === 'All'
        ? products
        : products.filter((p) => p.category === category);
    if (sort === 'Price low')
      rows = [...rows].sort((a, b) => a.price - b.price);
    if (sort === 'Price high')
      rows = [...rows].sort((a, b) => b.price - a.price);
    return rows;
  }, [category, sort]);
  return (
    <main>
      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> INDEPENDENT DIGITAL GOODS
          </p>
          <h1>
            BUILT FOR
            <br />
            <em>WHAT’S NEXT.</em>
          </h1>
          <p className="hero-lede">
            Opinionated design systems, code kits and visual assets for people
            who make the internet.
          </p>
          <a href="#shop" className="primary-cta">
            Explore the collection <ArrowDownRight />
          </a>
          <div className="hero-proof">
            <span>
              <Check /> Lifetime updates
            </span>
            <span>
              <Check /> Clear licensing
            </span>
          </div>
        </div>
        <div className="hero-art" aria-label="Animated product system preview">
          <div className="art-grid" />
          <div className="art-window window-back">
            <i />
            <i />
            <i />
          </div>
          <div className="art-window window-front">
            <div className="code-lines">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <b>OG</b>
          </div>
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <span className="art-note">SYSTEM 01 / 16</span>
        </div>
      </section>
      <section className="ticker">
        <div>
          DESIGN SYSTEMS ✦ PRODUCTION CODE ✦ ICON LIBRARIES ✦ LAUNCH PACKS ✦
          MADE FOR MOMENTUM ✦
        </div>
      </section>
      <section className="shop-section" id="shop">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CURATED ESSENTIALS</p>
            <h2>
              Tools that keep
              <br />
              you in flow.
            </h2>
          </div>
          <p className="section-intro">
            Buy once. Use forever. Every Offgrid asset is made to remove
            friction between idea and launch.
          </p>
        </div>
        <div className="filter-bar">
          <div className="filter-scroll">
            {categories.map((c) => (
              <button
                key={c}
                className={category === c ? 'active' : ''}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
          >
            <option>Featured</option>
            <option>Price low</option>
            <option>Price high</option>
          </select>
        </div>
        <div className="product-grid">
          {shown.map((p, i) => (
            <ProductCard product={p} index={i} key={p.id} />
          ))}
        </div>
      </section>
      <section className="collection-story" id="collections">
        <div className="story-copy">
          <p className="eyebrow">OFFGRID / SYSTEM 04</p>
          <h2>
            One system.
            <br />
            Zero dead ends.
          </h2>
          <p>
            Nexus turns scattered decisions into a coherent product
            language—from the first wireframe to the final handoff.
          </p>
          <a href="/product/nexus-ui">
            Explore Nexus <ArrowRight />
          </a>
        </div>
        <div className="story-stage">
          <div className="story-toolbar">
            <span>DESKTOP / 1440</span>
            <span>
              <MousePointer2 /> 3 collaborators
            </span>
          </div>
          <div className="story-ui">
            <aside>
              <b>N</b>
              <i />
              <i />
              <i />
              <i />
            </aside>
            <div>
              <header />
              <section>
                <span />
                <span />
                <span />
              </section>
              <footer />
            </div>
          </div>
          <button className="play">
            <Play fill="currentColor" /> See it in motion
          </button>
        </div>
      </section>
      <section className="category-grid">
        <a href="#shop" onClick={() => setCategory('UI Systems')}>
          <small>01 / UI SYSTEMS</small>
          <h3>
            Interfaces that
            <br />
            already agree.
          </h3>
          <Layers3 />
          <ArrowRight />
        </a>
        <a href="#shop" onClick={() => setCategory('Code Kits')}>
          <small>02 / CODE KITS</small>
          <h3>
            Skip setup.
            <br />
            Start shipping.
          </h3>
          <code>&lt;/&gt;</code>
          <ArrowRight />
        </a>
      </section>
      <section className="journal" id="journal">
        <div>
          <p className="eyebrow">FIELD NOTES / 006</p>
          <h2>
            Make less.
            <br />
            <em>Mean more.</em>
          </h2>
        </div>
        <div>
          <p>
            “The best tools disappear into the work. Offgrid is a study in
            removing everything that gets between you and a good decision.”
          </p>
          <span>— OFFGRID STUDIO</span>
        </div>
      </section>
      <section className="newsletter">
        <p>THE OFFGRID DISPATCH</p>
        <h2>
          New systems.
          <br />
          No noise.
        </h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label className="sr-only" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="you@studio.com"
          />
          <button>
            Join the list <ArrowRight />
          </button>
        </form>
      </section>
      <footer className="site-footer">
        <div>
          <span className="footer-mark">OFFGRID</span>
          <p>Digital goods for people who ship.</p>
        </div>
        <div>
          <h4>SHOP</h4>
          <a href="#shop">All products</a>
          <a href="#collections">Collections</a>
          <a href="#journal">Field notes</a>
        </div>
        <div>
          <h4>HELP</h4>
          <a href="/order-lookup">Order lookup</a>
          <a href="/policies">Shipping & returns</a>
          <a href="mailto:hello@offgrid.tools">Support</a>
        </div>
        <div>
          <h4>ACCOUNT</h4>
          <a href="/login">Sign in</a>
          <a href="/admin">Admin demo</a>
        </div>
        <small>© 2026 OFFGRID STUDIO · USD / INR</small>
      </footer>
    </main>
  );
}
