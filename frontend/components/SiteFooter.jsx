export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <span className="footer-mark">OFFGRID</span>
        <p>Digital goods for people who ship.</p>
      </div>
      <div>
        <h4>SHOP</h4>
        <a href="/#shop">All products</a>
        <a href="/#collections">Collections</a>
        <a href="/#journal">Field notes</a>
      </div>
      <div>
        <h4>HELP</h4>
        <a href="/order-lookup">Order lookup</a>
        <a href="/policies">Shipping &amp; returns</a>
        <a href="mailto:hello@offgrid.tools">Support</a>
      </div>
      <div>
        <h4>ACCOUNT</h4>
        <a href="/login">Sign in</a>
        <a href="/admin">Admin demo</a>
      </div>
      <small>© 2026 OFFGRID STUDIO · USD / INR</small>
    </footer>
  );
}
