import React, { useRef, useState } from "react";
import { API } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { useFormFields } from "../../libs/hooksLib";
import { s3Upload } from "../../libs/awsLib";
import { onError } from "../../libs/errorLib";
import Form from "react-bootstrap/Form";
import LoaderButton from "../../components/LoaderButton";
import config from "../../config";
import '../style.css'

export default function NewProject() {
  const file = useRef(null);
  const history = useHistory();
  const [checked, setChecked] = useState(true);
  const [fields, handleFieldChange] = useFormFields({
    projectName: "",
    projectDescription: "",
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return fields.projectName.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
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
      const attachment = file.current ? await s3Upload(file.current) : null;

      await createProject({ fields, attachment });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function createProject(project) {
    return API.post("projects", "/projects", {
      body: project,
    });
  }

  function handleCheckbox(e) {
    const event = { target: { id: e.target.id, value: !checked } };
    setChecked(!checked);
    handleFieldChange(event);
  }

  return (
    <div className="NewProject">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="projectName">
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            value={fields.projectName}
            as="input"
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="projectDescription">
          <Form.Label>Project Description</Form.Label>
          <Form.Control
            value={fields.projectDescription}
            as="textarea"
            onChange={handleFieldChange}
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
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </Form>
    </div>
  );
}
