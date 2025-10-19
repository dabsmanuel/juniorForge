const PrivacyPolicy = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-32">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cookies We Use</h2>
        <p className="mb-4">
          We use Vercel Analytics to understand how visitors interact with our website. 
          This helps us improve your experience.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Analytics Cookies:</strong> Used to collect anonymous data about page views and user behavior</li>
          <li><strong>Duration:</strong> Session-based and persistent cookies</li>
          <li><strong>Purpose:</strong> Website performance analysis</li>
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Choices</h2>
        <p>
          You can accept or reject analytics cookies through our cookie banner. 
          Your choice will be remembered for future visits.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;