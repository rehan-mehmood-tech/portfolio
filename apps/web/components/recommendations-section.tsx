import { FaLinkedin } from "react-icons/fa";

const recommendations = [
  {
    name: "Zeeshan Ali",
    subtitle: "1st • Technical Project Manager | Software Engineer | Instructor | AI , Blockchain , Cloud, Cybersecurity , DevOps | Pakistan ✗ Middle East",
    date: "October 1, 2026 • Zeeshan was Rehan’s mentor",
    testimonial: "work hard to achieve all life goals",
    linkedin: "https://pk.linkedin.com/in/zeeshan-ali-dev",
  },
  {
    name: "Umair Khan",
    subtitle: "1st • AI Consultant | Award-Winning Agentic AI Engineer | Building Autonomous AI Systems That Cut Costs & Scale Revenue for US & EU Businesses .",
    date: "September 28, 2026 • Umair was Rehan’s teacher",
    testimonial: "Rehan is a motivated learner who is understanding the Full-stack webapps architecture and agentic AI concepts very well. I have noticed his technical skills and quick learning ability while he was dealing with technical tasks. He has good problem-solving experience and, he is fully responsible for his code and achievements.",
    linkedin: "https://pk.linkedin.com/in/umair-khan-7b87a4146",
  },
] as const;

export function RecommendationsSection() {
  return (
    <section className="recommendations-section landing-section-divider" aria-labelledby="recommendations-heading">
      <div className="recommendations-container">
        <header className="recommendations-header reveal">
          <p className="recommendations-eyebrow font-pixel">ENDORSEMENTS &amp; MENTORSHIP</p>
          <h2 id="recommendations-heading">See What Mentors Say About Rehan</h2>
          <p>Real feedback from industry leaders and engineers who have mentored and evaluated my work.</p>
        </header>

        <div className="recommendations-grid">
          {recommendations.map((recommendation) => (
            <article className="recommendation-card reveal" key={recommendation.name}>
              <header className="recommendation-card-header">
                <div>
                  <h3>{recommendation.name}</h3>
                  <p>{recommendation.subtitle}</p>
                </div>
                <a
                  href={recommendation.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${recommendation.name} on LinkedIn`}
                  title={`View ${recommendation.name} on LinkedIn`}
                >
                  <FaLinkedin aria-hidden="true" />
                </a>
              </header>
              <p className="recommendation-date">{recommendation.date}</p>
              <blockquote>
                <span aria-hidden="true">“</span>
                <p>{recommendation.testimonial}</p>
              </blockquote>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
