import React, { useState, useEffect } from "react";
import "./App.css";
import Inicio from "./Inicio.js";
import SignUp from "./SignUp.js";
import TableroMisiones from "./TableroMisiones.js";
import TableroJuegos from "./TableroJuegos.js";
import Navbar from "./Navbar.js";
import MisMisiones from "./MisMisiones.js";
import CrearMision from "./CrearMision.js";
import Chats from "./Chats.js";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";

const App = props => {
  /*const [docs, setDocs] = useState([]);
  const [err, setErr] = useState("");*/
  const [connected, setConnected] = useState(false);

  const [user, setUser] = useState(null);
  const [quests, setQuests] = useState([]);
  const [questsError, setQuestsError] = useState("");
  const [games, setGames] = useState([]);
  const [gamesError, setGamesError] = useState("");

  const [currentChat, setCurrentChat] = useState(null);
  const [currentChatId, setCurrentChatId] = useState("");

  useEffect(() => {
    if (!connected) {
      console.log(window.location.origin.toString().replace(/^http/, "ws"));
      const ws = new WebSocket(
        /*"ws://localhost:3001"*/ window.location.origin
          .toString()
          .replace(/^http/, "ws")
      );
      ws.onopen = () => {
        console.log("connnected to ws");
        setConnected(true);
        ws.onmessage = msg => {
          let res = JSON.parse(msg.data);
          console.log("got ws data", res);
          if (res.type === "quests") {
            setQuests(res.data);
          }
          if (res.type === "chats") {
            const i = res.data.indexOf(currentChatId);
            if (i !== -1) {
              console.log(res.data[i]);
              setCurrentChat(res.data[i]);
            }
          }
        };
      };
    }
  }, [connected, user, quests, currentChatId]);

  const GetQuests = () => {
    fetch("/quests")
      .then(res => res.json())
      .then(data => {
        setQuests(data);
        setQuestsError("");
      })
      .catch(err =>
        setQuestsError(
          "No fue posible obtener las misiones, por favor intentelo de nuevo"
        )
      );
  };

  const GetGames = () => {
    fetch("/games")
      .then(res => res.json())
      .then(data => {
        setGames(data);
        setGamesError("");
      })
      .catch(err =>
        setGamesError(
          "No fue posible obtener infromación de los juegos disponibles, por favor intentelo de nuevo"
        )
      );
  };

  const GetCurrentChat = currentChatId => {
    setCurrentChatId(currentChatId);
    fetch("/chats/" + currentChatId)
      .then(res => res.json())
      .then(data => {
        setCurrentChat(data);
      })
      .catch(err => {});
  };

  return (
    <div className="App">
      <HashRouter>
        <Navbar currentUser={user} />
        {user !== null ? <Redirect push to="/tablero" /> : ""}
        {/* envolvemos nuestra aplicación en el Router  */}
        <Switch>
          {/* también la envolvemos en el componente Switch */}
          <Route
            path="/"
            render={propiedades => (
              <Inicio {...propiedades} setUser={setUser} />
            )}
            exact
          />
          <Route
            path="/signup"
            render={propiedades => (
              <SignUp {...propiedades} setUser={setUser} />
            )}
            exact
          />
          <Route
            path="/tablero"
            render={propiedades => (
              <TableroMisiones
                {...propiedades}
                currentUser={user}
                GetQuests={GetQuests}
                quests={quests}
                questsError={questsError}
              />
            )}
            exact
          />
          <Route
            path="/juegos"
            render={propiedades => (
              <TableroJuegos
                {...propiedades}
                currentUser={user}
                GetGames={GetGames}
                games={games}
                gamesError={gamesError}
                setUser={setUser}
              />
            )}
            exact
          />
          <Route
            path="/mis-misiones"
            render={propiedades => (
              <MisMisiones
                {...propiedades}
                quests={quests}
                currentUser={user}
              />
            )}
            exact
          />
          <Route
            path="/crear-mision"
            render={propiedades => (
              <CrearMision {...propiedades} currentUser={user} />
            )}
            exact
          />
          <Route
            path="/chats"
            render={propiedades => (
              <Chats
                {...propiedades}
                currentUser={user}
                GetCurrentChat={GetCurrentChat}
                currentChat={currentChat}
              />
            )}
            exact
          />
          {/* y creamos nuestras rutas */}
        </Switch>
      </HashRouter>
    </div>
  );
};

export default App;
