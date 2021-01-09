import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import MyPeer from "./peer";
import socket from "./socket";

import "./App.css";
import { ReactComponent as PlayButton } from "./play-button.svg";

import PodcastCreatePopup from "./PodcastCreatePopup";

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

function App() {
  const [podcasStart, setPodcastStart] = useState(false); //ayni yayinci birden fazla yayin acmamasi icin
  const [popupStatus, setPopupStatus] = useState(false); //popup pencere durumu
  const [podcastList, setPodcastList] = useState([]); //podcast lerin listesi
  const [isListenPodcastData, setIslistPodcastData] = useState(null); //dinlenilen podcast datasi
  const [numberOfListeners, setNumberOfListeners] = useState(0);

  useEffect(() => {
    socket.on("podcastList", function (data) {
      setPodcastList(data);
    });

    MyPeer.on("call", function (call) {
      navigator.getUserMedia(
        { video: false, audio: true },

        function success(audioStream) {
          setNumberOfListeners(numberOfListeners + 1);
          call.answer(audioStream);
        },

        function error(err) {
          console.log(err);
        }
      );
    });
  }, []);

  const startPodcast = (podcastName) => {
    if (podcasStart) {
      alert("ayni yayinci birden fazla yayin acamaz");
      return;
    }

    setPodcastStart(true);
    setPopupStatus(false);

    if (podcastName.length === 0) {
      return;
    }
    const podcastId = uuidv4();
    socket.emit("startPodcast", podcastName, podcastId, MyPeer.id);
  };

  const podcastJoin = (podcastId) => {
    const thisPodcast = podcastList.find((item) => item.id === podcastId);

    setIslistPodcastData(thisPodcast);

    if (thisPodcast !== undefined) {
      navigator.getUserMedia(
        { video: false, audio: true },

        function success(audioStream) {
          console.log("thisPodcast.peers[0]", thisPodcast.peers[0]);
          var outgoing = MyPeer.call(thisPodcast.peers[0], audioStream);
          outgoing.on("stream", (stream) => {
            var sound = document.createElement("audio");
            sound.srcObject = stream;
            sound.addEventListener("loadedmetadata", () => {
              sound.play();
            });
          });
        },

        function error(err) {
          console.log(err);
        }
      );
    } else {
      alert("gecerli bir yayin seciniz");
    }
  };

  return (
    <>
      {popupStatus && (
        <PodcastCreatePopup
          setPopupStatus={setPopupStatus}
          startPodcast={startPodcast}
        />
      )}
      <div className="main container">
        <div className="large-button" onClick={() => setPopupStatus(true)}>
          Podcaste Basla
        </div>
        {numberOfListeners > 0 && (
          <div className="listener-text">
            Dinleyici sayisi: {numberOfListeners}
          </div>
        )}
        {podcastList.length === 0 ? (
          <div className="empty-list">Liste Bos. Hadi hemen yayina basla !</div>
        ) : (
          <div className="list-group">
            {podcastList.map((item, key) => (
              <div
                key={key}
                className="list-item"
                onClick={() => podcastJoin(item.id)}
              >
                <p className="podcast-list-title">{item.podcastName}</p>
              </div>
            ))}
          </div>
        )}
        {isListenPodcastData !== null && (
          <>
            <div className="podcast-list-bar">
              <div className="podcast-list-description">
                <p className="podcast-list-title">
                  {isListenPodcastData.podcastName}
                </p>
                <p className="podcast-list-subTitle">
                  {Date.now() - isListenPodcastData.started}
                </p>
              </div>
              <div className="podcast-list-status">
                <PlayButton />
              </div>
              <div className="podcast-list-detail"></div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
