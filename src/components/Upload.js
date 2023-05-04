import React, { useState } from "react";
import { Link } from "react-router-dom";
import { uploadFile } from "react-s3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCloudUploadAlt, faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import "./Upload.css";

const config = {
  bucketName: process.env.REACT_APP_AWS_BUCKET,
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
};

function Upload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessfull, setUploadSuccessfull] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [isVerified, setVerified] = useState(false);
  const [tooManyFiles, setTooManyFiles] = useState(false);

  library.add(faCloudUploadAlt, faFolderPlus);

  const handleFileInput = (e) => {
    setTooManyFiles(false);

    let files = e.target.files;
    if (files.length > 10) {
      setTooManyFiles(true);
      files = Array.from(files).slice(0, 10);
    }

    setSelectedFiles(files);
    setUploadSuccessfull(false);
    setUploadError(false);
    setShowDescription(false);
  };

  const handleUpload = async (files) => {
    setIsUploading(true);
    setTooManyFiles(false);
    Promise.all(
      Array.from(files).map((file) => {
        return uploadFile(file, config)
          .then((data) => {
            console.log(data);
          })
          .catch((err) => {
            console.error(err);
          });
      })
    )
      .then(() => {
        setUploadSuccessfull(true);
        setIsUploading(false);
        setSelectedFiles([]);
      })
      .catch(() => {
        setIsUploading(false);
        setUploadError(true);
      });
  };

  const checkVerification = () => {
    if (localStorage.getItem("verified", false)) {
      setVerified(true);
    } else if (document.getElementById("verification-input").value === process.env.REACT_APP_VERIFICATION) {
      localStorage.setItem("verified", true);
      setVerified(true);
    } else {
      localStorage.setItem("verified", false);
      setVerified(false);
    }
  };

  const SelectedFilesList = () => {
    if (selectedFiles.length === 0) {
      return null;
    }

    const listSize = 5;
    const files = Array.from(selectedFiles)
      .slice(0, listSize)
      .map((file) => <li key={file.name}>{file.name}</li>);

    if (selectedFiles.length > listSize) {
      files.push(<li key="more">... und {selectedFiles.length - listSize} weitere Bilder</li>);
    }

    return <ul className="file-list">{files}</ul>;
  };

  const UploadButton = () => {
    if (selectedFiles.length === 0) {
      return null;
    }
    if (!isUploading) {
      return (
        <div className="submitButton" onClick={() => handleUpload(selectedFiles)}>
          <FontAwesomeIcon icon="cloud-upload-alt" />
          <span className="icon-text">{selectedFiles.length} Bilder ins Fotoalbum laden!</span>
        </div>
      );
    } else {
      return (
        <div className="upload-container">
          <div className="lds-heart">
            <div></div>
          </div>
          <span>Uploading...</span>
        </div>
      );
    }
  };

  const UploadSuccessfullMessage = () => {
    if (uploadSuccessfull) {
      return <p className="successfull-message">Upload erfolgreich! Vielen Dank für deinen Beitrag</p>;
    } else {
      return null;
    }
  };

  const UploadErrorMessage = () => {
    if (uploadError) {
      return <p className="error-message">Hier ist leider was schiefgegangen! Bitte versuche es später noch mal!</p>;
    } else {
      return null;
    }
  };

  const Description = () => {
    return (
      <div className={`description ${showDescription ? "" : "collapsed"}`}>
        Hier kannst du deine schönsten Bilder auf unseren Live-Fotoalbum Server hochladen. Die Bilder werden mit dem
        Bildschirm im Saal synchronisiert und in der Bildergallerie angezeigt. So entsteht ein Live-Fotoalbum, das wir
        alle mitgestalten können.
        <p>
          <b>
            <br></br>
            Wir bitten euch wirklich nur die Bilder hochzuladen, die ihr (auf dieser Feier) öffentlich zugänglich sehen
            wollt!
          </b>
        </p>
      </div>
    );
  };

  const Impressum = () => {
    return (
      <div
        className="impressum"
        onClick={(e) => {
          window.location = "mailto:chris.geb@gmx.de";
          e.preventDefault();
        }}
      >
        <a href="mailto:chris.geb@gmx.de">
          <p>Verantwortliche: Chris und Anne</p>
          <p>Bei Fragen gerne melden!</p>
          <p>
            <b>
              <br></br>
              Wir planen, alle Bilder nach der Feier über einen Cloudanbieter verfügbar zu machen. Falls ihr Zugriff auf
              die Bilder wollt, einfach eine Email an chris.geb@gmx.de schicken (einfach hier anklicken)
            </b>
          </p>
        </a>
      </div>
    );
  };

  const TooManyImages = () => {
    if (tooManyFiles) {
      return (
        <p className="error-message">
          Tut uns sehr leid, aber... die maximale Anzahl an Bilder pro Upload liegt derzeit bei 10!
        </p>
      );
    } else {
      return null;
    }
  };

  const AdminLink = () => {
    return <Link to={"/admin"} className="admin-link"></Link>;
  };

  const AppInterface = () => {
    const verified = isVerified || localStorage.getItem("verified", false);
    if (verified) {
      return (
        <div>
          <Description />
          <label htmlFor="file-upload" className="custom-file-upload">
            <FontAwesomeIcon icon="folder-plus" />
            <span className="icon-text">Bilder zum hochladen auswählen</span>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple="multiple"
            accept="image/png, image/jpeg"
            onChange={handleFileInput}
          />
          <SelectedFilesList />
          <UploadButton />
          <UploadSuccessfullMessage />
          <TooManyImages />
          <UploadErrorMessage />
          <Impressum />
          <AdminLink />
        </div>
      );
    } else {
      return (
        <div>
          <p className="description">
            Bevor es los geht, eine kurze Frage: Wie war der Nachname der Braut vor der Hochzeit?
          </p>
          <input id="verification-input" type="text" placeholder="Schmidt?... Huber?..." />
          <div className="submitButton" onClick={() => checkVerification(selectedFiles)}>
            Freischalten
          </div>
        </div>
      );
    }
  };

  return (
    <div className="page">
      <h1>Annes & Chris' Fotoalbum</h1>
      <AppInterface />
    </div>
  );
}

export default Upload;
