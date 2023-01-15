import React from 'react';
import Image from '../image';
import { Project } from '../../type';
import * as S from './styled';

type ProjectCardProps = {
  project: Project;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <S.Wrapper>
      <S.ImageSection>
        <S.StyledImage src={project.thumbnailUrl} />
      </S.ImageSection>

      <S.Title>{project.title}</S.Title>
      <S.Description>{project.description}</S.Description>

      {Object.keys(project.links).map(
        (link, index) =>
          project.links[link as keyof typeof project.links] && (
            <S.ProjectLinkButton key={index} href={link}>
              {link}
            </S.ProjectLinkButton>
          ),
      )}

      {project.techStack.map((tech, index) => (
        <S.TechStack>{tech}</S.TechStack>
      ))}
    </S.Wrapper>
  );
};

export default ProjectCard;
