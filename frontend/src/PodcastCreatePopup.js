import React, { useState } from "react";

import "./popup.css";
import { ReactComponent as Error } from "./error.svg";

export default function PodcastCreatePopup({ setPopupStatus, startPodcast }) {
  const [podcastName, setPodcastName] = useState("");
  return (
    <div className="popupFull">
      <div className="popup-box">
        <div className="popup-box-header">
          <p className="popup-box-header-title">Podcastinize isim verin</p>
          <span
            className="popup-box-header-close"
            onClick={() => setPopupStatus(false)}
          >
            <Error />
          </span>
        </div>
        <div className="popup-box-body">
          <input
            autoFocus
            type="text"
            value={podcastName}
            onChange={(e) => setPodcastName(e.target.value)}
          />
          <span onClick={() => startPodcast(podcastName)}>Basla</span>
        </div>
      </div>
    </div>
  );
}
