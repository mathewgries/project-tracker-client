import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { s3Upload } from "../../libs/awsLib";
import { onError } from "../../libs/errorLib";
import Form from "react-bootstrap/Form";
import LoaderButton from "../../components/LoaderButton";
import config from "../../config";
import "../style.css";

export default function Notes() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [project, setProject] = useState(null);
  const [checked, setChecked] = useState(true);
  const [fields, setFields] = useState({
    projectName: "",
    projectDescription: "",
    isActive: null,
  });

  useEffect(() => {
    function loadProject() {
      return API.get("projects", `/projects/${id}`);
    }

    async function onLoad() {
      try {
        const project = await loadProject();
        const { attachment } = project;

        if (attachment) {
          project.attachmentURL = await Storage.vault.get(attachment);
        }

        setFields({
          projectName: project.projectName,
          projectDescription: project.projectDescription,
          isActive: project.isActive,
        })
        setChecked(project.isActive)
        setProject(project);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return fields.projectName.length > 0;
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  function saveProject(project) {
    return API.put("projects", `/projects/${id}`, {
      body: project,
    });
  }

  async function handleSubmit(event) {
    let attachment;

    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
      }

      await saveProject({
        ...fields,
      });
      history.push("/projects");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteProject() {
    return API.del("projects", `/projects/${id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteProject();
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  function handleCheckbox(e) {
    setChecked(!checked);
    setFields({...fields, isActive: !checked});
  }

  return (
    <div className="NewProject">
      {project && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="projectName">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              value={fields.projectName}
              as="input"
              onChange={(e) => setFields({...fields, [e.target.id]: e.target.value})}
            />
          </Form.Group>
          <Form.Group controlId="projectDescription">
            <Form.Label>Project Description</Form.Label>
            <Form.Control
              value={fields.projectDescription}
              as="textarea"
              onChange={(e) => setFields({...fields, [e.target.id]: e.target.value})}
            />
          </Form.Group>
          <Form.Group controlId="isActive">
            <Form.Check
              type="checkbox"
              label="Active"
              value={fields.isActive}
              checked={checked}
              onChange={(e) => handleCheckbox(e)}
            />
          </Form.Group>
          <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
            {project.attachment && (
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={project.attachmentURL}
                >
                  {formatFilename(project.attachment)}
                </a>
              </p>
            )}
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </Form>
      )}
    </div>
  );
}
