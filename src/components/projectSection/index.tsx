import React from 'react';
import Image from '../image';
import { Project } from '../../type';

type ProjectSectionProps = {
  projects: Project[];
};

const ProjectSection: React.FC<ProjectSectionProps> = ({ projects }) => {
  if (!projects || projects.length < 2) return null;
  return (
    <div className='project-section'>
      {projects.map((project, index) =>
        index === 0 ? null : (
          <div className='project' key={index}>
            <div className='head'>
              {project.title}&nbsp;&nbsp;
              {/* {project.links && <IconButtonBar links={project.links} style={{ color: '#a8a8a8', fontSize: 24 }} />} */}
            </div>
            <div className='body'>
              <Image src={project.thumbnailUrl} />

              {project.techStack && (
                <div className='tech-stack'>
                  {project.techStack.map((tech, index) => (
                    <div key={index} className='tech'>
                      {tech}
                    </div>
                  ))}
                </div>
              )}
              <div className='description'>{project.description}</div>
            </div>
          </div>
        ),
      )}
    </div>
  );
};

export default ProjectSection;
