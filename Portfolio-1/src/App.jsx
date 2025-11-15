import "./index.css";

function App() {
  return (
    <div className="container fade-in">
      {/* HEADER / HERO */}
      <header className="hero">
        <h1 className="name">Hemanth Harsha Rangaswamy Anitha</h1>
        <p className="title">Computer Science Student</p>

        
      </header>

      {/* PROJECTS FIRST */}
      <section className="section">
        <h2>Projects</h2>

        <div className="project-card">
          <h3>MovieHub Web Application</h3>
          <p>
            Developed a full-stack movie application using React, Spring Boot,
            and MongoDB. Created and maintained detailed version documentation,
            ensuring accurate synchronization with development updates to
            improve clarity and review efficiency.
          </p>
          <a
            href="https://github.com/Guard33/moviedux"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Repository →
          </a>
        </div>
      </section>

      {/* PROFESSIONAL SUMMARY */}
      <section className="section">
        <h2>Professional Summary</h2>
        <p>
          Detail-oriented Computer Science student skilled in analyzing complex
          information, resolving inconsistencies, and producing clear, accurate
          technical documentation. Strong experience maintaining organized
          version control practices and communicating technical details clearly.
        </p>
      </section>

      {/* SKILLS WITH ICON PILL BADGES */}
      <section className="section">
        <h2>Stacks / Tools</h2>

        <div className="skill-grid">
          <div className="skill-pill">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" />
            <span>React</span>
          </div>

          <div className="skill-pill">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" />
            <span>TypeScript</span>
          </div>

          <div className="skill-pill">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" />
            <span>Python</span>
          </div>

          <div className="skill-pill">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" />
            <span>C</span>
          </div>

          <div className="skill-pill">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" />
            <span>Tailwind CSS</span>
          </div>

          <div className="skill-pill">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" />
            <span>Java</span>
          </div>

          <div className="skill-pill">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" />
            <span>Node.js</span>
          </div>

          <div className="skill-pill">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" />
            <span>MongoDB</span>
          </div>

          <div className="skill-pill">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" />
            <span>MySQL</span>
          </div>

          <div className="skill-pill">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" />
            <span>Docker</span>
          </div>

          <div className="skill-pill">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" />
            <span>Git</span>
          </div>

          <div className="skill-pill">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" />
            <span>GitHub</span>
          </div>
        </div>
      </section>

      
{/* CONTACT ME */}
<section className="section contact-section">
  <h2>Contact Me</h2>

  <div className="contact-icons">
    <a
      href="https://github.com/Guard33"
      target="_blank"
      rel="noreferrer"
      className="contact-icon-box"
    >
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" />
    </a>

    <a
      href="https://www.linkedin.com/in/hemanth-harsha-rangaswamy-anitha-a59462313/"
      target="_blank"
      rel="noreferrer"
      className="contact-icon-box"
    >
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" />
    </a>

    <a
      href="mailto:hemanthhra12@gmail.com"
      className="contact-icon-box"
    >
      <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" />
    </a>
  </div>

  <div className="email-pill">
    hemanthhra12@gmail.com
  </div>
</section>

      {/* FOOTER */}
      <footer className="footer">
        © {new Date().getFullYear()} Hemanth Harsha Rangaswamy Anitha
      </footer>
    </div>
  );
}

export default App;
