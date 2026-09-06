import { ArrowRight } from 'lucide-react';
export default function Login() {
  return (
    <main className="simple-page">
      <div>
        <p className="eyebrow">OPTIONAL ACCOUNT</p>
        <h1>
          Keep your
          <br />
          tools close.
        </h1>
        <p>
          Sign in to see past orders, download updates and manage licenses.
          Guest checkout stays available.
        </p>
        <form>
          <label>
            Email
            <input type="email" required placeholder="you@studio.com" />
          </label>
          <label>
            Password
            <input type="password" required />
          </label>
          <button className="add-large">
            Sign in <ArrowRight />
          </button>
        </form>
        <p className="form-hint">Demo: admin@offgrid.tools / offgrid-demo</p>
      </div>
    </main>
  );
}
