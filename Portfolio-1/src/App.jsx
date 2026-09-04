import "./index.css";

import moviehub from "./images/moviehub.jpg";
import fishmarket from "./images/fishmarket.jpg";
import notepad from "./images/notepad.svg";

function App() {
  return (
    <div className="container">

      {/* HERO INTRO */}
      <section className="intro">
        <h1 className="intro-name">Hemanth Harsha</h1>
        <p className="intro-scroll">Scroll to see more about me ↓</p>
      </section>



      {/* PROJECTS */}
      <section className="section">

        <h2 className="section-title">Projects</h2>

        <div className="projects-grid">

          <ProjectCard
            image={notepad}
            title="Notepad"
            description="Full-stack notes app — sign up, write and tag notes, search, pin, archive, and trash/restore. Deployed live on Vercel and Render; the free-tier backend sleeps after 15 minutes idle, so the first load after a gap can take up to a minute to wake up."
            tech={["React","Express","MongoDB"]}
            link="https://github.com/Guard33/notepad-app"
            liveLink="https://notepad-app-brown.vercel.app"
          />

          <ProjectCard
            image={moviehub}
            title="MovieHub"
            description="Full-stack movie application built using React, Spring Boot and MongoDB."
            tech={["React","Spring Boot","MongoDB"]}
            link="https://github.com/Guard33/moviedux"
          />

          <ProjectCard
            image={fishmarket}
            title="Fish Market"
            description="Marketplace-style application for browsing fish product listings."
            tech={["Vue","Spring Boot","MySQL"]}
            link="https://github.com/Guard33/FishMarket"
          />

        </div>

      </section>



      {/* SUMMARY */}
      <section className="section">

        <h2 className="section-title">Professional Summary</h2>

        <p className="summary">
          Detail-oriented Computer Science student skilled in analyzing complex
          information, resolving inconsistencies, and producing clear technical
          documentation. Strong experience with version control workflows and
          collaborative development environments.
        </p>

      </section>



      {/* SKILLS */}
      <section className="section">

        <h2 className="section-title">Stacks / Tools</h2>

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
      <section className="contact-section">

        <h2>Contact Me</h2>

        <div className="contact-icons">

          <a href="https://github.com/Guard33" target="_blank" rel="noreferrer">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"/>
          </a>

          <a
            href="https://www.linkedin.com/in/hemanth-harsha-rangaswamy-anitha-a59462313/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"/>
          </a>

          <a href="mailto:hemanthhra12@gmail.com">
            <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png"/>
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

        {liveLink && (
          <a href={liveLink} target="_blank" rel="noreferrer" style={{ marginRight: 16 }}>
            Live Demo →
          </a>
        )}

        <a href={link} target="_blank" rel="noreferrer">
          GitHub →
        </a>

      </div>

    </div>

  )

}



function Skill({icon,name}){

  return(

    <div className="skill">

      <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}`}/>

      <span>{name}</span>

    </div>

  )

}

export default App;
