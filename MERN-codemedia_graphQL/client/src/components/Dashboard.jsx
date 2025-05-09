import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import MySnippets from "./MySnippets";
import CreateSnippet from "./CreateSnippet";
import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";

export default function Dashboard() {
  const { loading, data } = useQuery(GET_ME);
  const mySnippets = data?.me?.snippetCount;
  const userName = data?.me?.username;
  const lastUpdate = data?.me?.savedSnippets;

  let lastCreatedAt = null;

  if (lastUpdate && lastUpdate.length > 0) {
    const lastSnippet = lastUpdate[lastUpdate.length - 1];
    lastCreatedAt = lastSnippet.createdAt;
  }

  const formattedDate = lastCreatedAt ? new Date(parseInt(lastCreatedAt)).toLocaleString() : '';

  return (
    <div className="container bg-dark mt-5 text-white"style={{borderRadius:"50px"}}>
      <div className="row">
        <div className="col-md-4 mb-4 mt-5">
          <div className="card bg-danger" style={{borderRadius:"50px"}}>
            <div className="card-body">
              <h5 className="card-title">Hi, {userName}</h5>
              <p className="card-text">You have {mySnippets} snippets.</p>
            </div>
            <div className="card-body">
              <h5 className="card-title">Last Update</h5>
              <p className="card-text">Last update: {formattedDate}</p>
            </div>
          </div>
        </div>
        <div className="col-md-8 mb-4 mt-5">
          <CreateSnippet />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <MySnippets />
        </div>
      </div>
    </div>
  );
}