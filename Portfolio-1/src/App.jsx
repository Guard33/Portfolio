import "./index.css";

import moviehub from "./images/moviehub.jpg";
import fishmarket from "./images/fishmarket.jpg";
import tidewater from "./images/tidewater.jpg";
import NightStreet from "./components/NightStreet";

function App() {
  return (
    <div className="container">

      {/* HERO INTRO */}
      <section className="intro">
        <NightStreet />
        <h1 className="intro-name">Hemanth Harsha</h1>
        <p className="intro-role">Full-Stack Software Engineer</p>
        <p className="intro-tagline">
          I build production web applications end-to-end — React and Vue front ends,
          Spring Boot and Node.js APIs, backed by SQL and NoSQL data layers.
        </p>
        <div className="intro-actions">
          <a href="#projects" className="btn btn-primary">View Projects</a>
          <a href="#contact" className="btn btn-outline">Get in Touch</a>
        </div>
        <p className="intro-scroll">Scroll to see more ↓</p>
      </section>



      {/* PROJECTS */}
      <section className="section" id="projects">

        <p className="section-kicker">Work</p>
        <h2 className="section-title">Projects</h2>

        <div className="projects-grid">

          <ProjectCard
            image={tidewater}
            title="Tidewater Prints"
            description="Full-stack e-commerce store for generative art posters — search and filters, cart, checkout with Canadian tax by province, order history, and a role-based admin dashboard. Server-side pricing and atomic stock reservation; try it with a one-click demo account."
            tech={["React","Express","MongoDB"]}
            link="https://github.com/Guard33/notepad-app"
            liveLink="https://tidewater-prints.vercel.app"
          />

          <ProjectCard
            image={moviehub}
            title="MovieHub"
            description="Full-stack movie discovery app with authentication and watchlist management — REST APIs backed by a MongoDB schema modeled for efficient queries, built cloud-deployment-ready on AWS."
            tech={["React","Spring Boot","MongoDB"]}
            link="https://github.com/Guard33/moviedux"
          />

          <ProjectCard
            image={fishmarket}
            title="Fish Market"
            description="Full-stack e-commerce marketplace with real-time cart updates and OAuth authentication, backed by a relational schema for inventory, users, and transactions — deployed on Azure."
            tech={["Vue","Spring Boot","MySQL"]}
            link="https://github.com/Guard33/FishMarket"
          />

        </div>

      </section>



      {/* SUMMARY */}
      <section className="section">

        <p className="section-kicker">About</p>
        <h2 className="section-title">Professional Summary</h2>

        <p className="summary">
          Full-stack software engineer and final-year Computer Science student at Saint
          Mary's University (graduating December 2026), building production-ready
          applications across React, Node.js, and Spring Boot. At Outlier AI (2025–2026)
          I evaluated AI model outputs for accuracy and consistency, and built React-based,
          form-driven interfaces and a reusable component library for the Andromeda UI
          project. Comfortable owning a project end-to-end — from relational and document
          database design through deployment on AWS, Azure, and GCP.
        </p>

      </section>



      {/* SKILLS */}
      <section className="section">

        <p className="section-kicker">Toolkit</p>
        <h2 className="section-title">Skills</h2>

        <div className="skills-grid">

          <Skill icon="react/react-original.svg" name="React"/>
          <Skill icon="typescript/typescript-original.svg" name="TypeScript"/>
          <Skill icon="python/python-original.svg" name="Python"/>
          <Skill icon="java/java-original.svg" name="Java"/>
          <Skill icon="nodejs/nodejs-original.svg" name="Node.js"/>
          <Skill icon="mongodb/mongodb-original.svg" name="MongoDB"/>
          <Skill icon="mysql/mysql-original.svg" name="MySQL"/>
          <Skill icon="docker/docker-original.svg" name="Docker"/>
          <Skill icon="git/git-original.svg" name="Git"/>
          <Skill icon="github/github-original.svg" name="GitHub"/>

        </div>

      </section>



      {/* CONTACT */}
      <section className="contact-section" id="contact">

        <p className="section-kicker">Get in Touch</p>
        <h2>Contact Me</h2>

        <div className="contact-icons">

          <a href="https://github.com/Guard33" target="_blank" rel="noreferrer" className="contact-tile">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt=""/>
            <span>GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/in/hemanth-harsha-rangaswamy-anitha-a59462313/"
            target="_blank"
            rel="noreferrer"
            className="contact-tile"
          >
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt=""/>
            <span>LinkedIn</span>
          </a>

          <a href="mailto:hemanthhra12@gmail.com" className="contact-tile">
            <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" alt=""/>
            <span>Email</span>
          </a>

        </div>

        <p className="email">hemanthhra12@gmail.com</p>

      </section>



      {/* FOOTER */}
      <footer className="footer">
        © {new Date().getFullYear()} Hemanth Harsha Rangaswamy Anitha
      </footer>

    </div>
  );
}



function ProjectCard({image,title,description,tech,link,liveLink}){

  return(

    <div className="project-card">

      <img src={image} className="project-image"/>

      <div className="project-content">

        <h3>{title}</h3>

        <p>{description}</p>

        <div className="tech-tags">
          {tech.map((t,i)=>(
            <span key={i}>{t}</span>
          ))}
        </div>

        <div className="links">
          {liveLink && (
            <a href={liveLink} target="_blank" rel="noreferrer">
              Live Demo →
            </a>
          )}

          <a href={link} target="_blank" rel="noreferrer">
            GitHub →
          </a>
        </div>

      </div>

    </div>

  )

}



function Skill({icon,name}){

  return(

    <div className="skill">

      <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}`} alt=""/>

      <span>{name}</span>

    </div>

  )

}

export default App;
