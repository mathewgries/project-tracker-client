import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../../libs/contextLib";
import { onError } from "../../libs/errorLib";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import '../style.css'

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const projects = await loadProjects();
        setProjects(projects);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadProjects() {
    return API.get("projects", "/projects");
  }

  function renderProjectList(projects) {
    return (
      <>
        <LinkContainer to="/projects/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new project</span>
          </ListGroup.Item>
        </LinkContainer>
        {projects.map(({ projectId, projectName, createdAt }) => (
          <LinkContainer key={projectId} to={`/projects/${projectId}`}>
            <ListGroup.Item action>
              <span className="font-weight-bold">
                {projectName.trim().split("\n")[0]}
              </span>
              <br />
              <span className="text-muted">
                Created: {new Date(createdAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Project Tracker</h1>
      </div>
    );
  }

  function renderProjects() {
    return (
      <div className="projects">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Projects</h2>
        <ListGroup>{!isLoading && renderProjectList(projects)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="project">
      {isAuthenticated ? renderProjects() : renderLander()}
    </div>
  );
}
