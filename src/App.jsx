import { useState } from "react";
import Login from "./Login";
import NotesRecents from "./NotesRecents";

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return <NotesRecents />;
}
