import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import { Button, Modal } from "react-bootstrap";
import MySnippets from "./MySnippets";
import CreateSnippet from "./CreateSnippet";
import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";

export default function Dashboard() {
  const { loading, data } = useQuery(GET_ME);
  const [showModal, setShowModal] = useState(false);
  const [deleteUser] = useMutation(DELETE_USER);

  const mySnippets = data?.me?.savedSnippets?.length ?? 0;
  const userName = data?.me?.username;
  const lastUpdate = data?.me?.savedSnippets;

  let lastCreatedAt = null;

  if (lastUpdate && lastUpdate.length > 0) {
    const lastSnippet = lastUpdate[lastUpdate.length - 1];
    lastCreatedAt = lastSnippet.createdAt;
  }

  const dateObject = lastCreatedAt ? new Date(parseInt(lastCreatedAt)) : null;

  const dateOnly = dateObject
    ? dateObject.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  const timeOnly = dateObject
    ? dateObject.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "";

  const handleDeleteUser = async () => {
    try {
      await deleteUser();
      Auth.logout(); // logs out and clears token
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="container mt-5"
      style={{ backgroundColor: "#F5EEDC", borderRadius: "20px", padding: "30px" }}
    >
      <div className="row">
        <div className="col-md-4 mb-4">
          <div
            className="card shadow"
            style={{ backgroundColor: "#27548A", borderRadius: "20px", color: "#F5EEDC" }}
          >
            <div className="card-body">
              <h5 className="card-title">Hi, {userName}</h5>
              <p className="card-text">
                You have {loading ? "Loading..." : mySnippets} snippets.
              </p>
              <Button
                onClick={() => setShowModal(true)}
                style={{
                  backgroundColor: "#D9534F",
                  borderColor: "#D43F3A",
                  color: "white",
                  marginTop: "10px",
                  width: "100%",
                }}
              >
                Delete My Account
              </Button>
            </div>
            <div
              className="card-body border-top"
              style={{ borderColor: "#DDA853" }}
            >
              <h6 className="card-title">Last Update</h6>
              <p className="card-text">Date: {dateOnly}</p>
              <p className="card-text">Time: {timeOnly}</p>
            </div>
          </div>
        </div>

        <div className="col-md-8 mb-4">
          <div className="p-3 shadow" style={{ backgroundColor: "#ffffff", borderRadius: "20px" }}>
            <CreateSnippet />
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-12">
          <div className="p-3 shadow" style={{ backgroundColor: "#ffffff", borderRadius: "20px" }}>
            <MySnippets />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#27548A", color: "#F5EEDC" }}
        >
          <Modal.Title>Confirm Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#F5EEDC", color: "#183B4E" }}>
          Are you sure you want to delete your account? This action cannot be undone and all your snippets will be permanently deleted.
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#F5EEDC" }}>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            style={{ backgroundColor: "#27548A", borderColor: "#27548A" }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteUser}
            style={{ backgroundColor: "#D9534F", borderColor: "#D43F3A" }}
          >
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
