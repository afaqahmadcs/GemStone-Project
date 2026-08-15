import './AboutExpertise.css';

export default function TrustSection() {
  const principles = [
    {
      title: "TRANSPARENCY",
      description: "Clear gemstone descriptions, certified parameters, and origin statements presented without unnecessary complexity or inflation."
    },
    {
      title: "DETAIL",
      description: "Comprehensive gemological metrics and physical specifications organized in an easy-to-understand structural format."
    },
    {
      title: "PERSONAL ENQUIRY",
      description: "A direct, personal channel to discuss gemstone characteristics and arrange viewings before making acquisition decisions."
    }
  ];

  return (
    <section className="trust-section" aria-labelledby="trust-heading">
      <div className="container">
        <h2 id="trust-heading">Clarity at Every Step.</h2>
        <div className="trust-grid">
          {principles.map((p, idx) => (
            <div key={idx} className="trust-card">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
