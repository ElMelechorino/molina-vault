import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function NotesRecents() {
  const [notes, setNotes] = useState([]);
  const [active, setActive] = useState(null);
  const [text, setText] = useState("");

  // cargar recientes
  async function loadNotes() {
    const { data } = await supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(5);

    if (data) setNotes(data);
  }

  // crear nueva nota
 async function newNote() {
  console.log("Creando nota...");

  const { data, error } = await supabase
    .from("notes")
    .insert([
      {
        title: "Nueva nota",
        content: "",
        updated_at: new Date(),
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) {
    alert("Error creando nota: " + error.message);
    console.error(error);
    return;
  }

  console.log("Nota creada:", data);

  setActive(data);
  setText(data.content);

  loadNotes();
}

  // eliminar notas
 async function deleteNote(noteId) {
  const confirmDelete = confirm("¿Seguro que quieres borrar esta nota?");

  if (!confirmDelete) return;

  await supabase.from("notes").delete().eq("id", noteId);

  // Si borraste la nota abierta, limpiar editor
  if (active?.id === noteId) {
    setActive(null);
    setText("");
  }

  loadNotes();
}

  // abrir nota
  function openNote(note) {
    setActive(note);
    setText(note.content);
  }

  // autosave
  useEffect(() => {
    if (!active) return;

    const timer = setTimeout(async () => {
      await supabase
        .from("notes")
        .update({
          content: text,
          updated_at: new Date(),
        })
        .eq("id", active.id);

      loadNotes();
    }, 1000);

    return () => clearTimeout(timer);
  }, [text]);

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 250,
          padding: 20,
          background: "#f3f3f3",
          borderRight: "1px solid #ddd",
        }}
      >
        <h2>🕒 Recientes</h2>

        <button
          onClick={newNote}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Nueva nota
        </button>

        <div style={{ marginTop: 15 }}>
          {notes.map((note) => (
            <div
                key={note.id}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 8,
                    cursor: "pointer",
                    background: active?.id === note.id ? "#ddd" : "transparent",
                }}
            >
                {/* Abrir nota */}
                <span onClick={() => openNote(note)} style={{ flex: 1 }}>
                    {note.title}
                </span>

                {/* Botón borrar */}
                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                    }}
                    style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 16,
                    }}
                >
                    🗑️
                </button>
            </div>

          ))}
        </div>
      </div>

      {/* Editor */}
      <div style={{ flex: 1, padding: 30 }}>
        {!active ? (
          <p>Selecciona o crea una nota ✍️</p>
        ) : (
          <>
            <input
            value={active.title}
            onChange={(e) =>
                setActive({ ...active, title: e.target.value })
            }
            onBlur={async () => {
                await supabase
                .from("notes")
                .update({ title: active.title })
                .eq("id", active.id);

                loadNotes();
            }}
            style={{
                fontSize: 26,
                fontWeight: "bold",
                border: "none",
                outline: "none",
                background: "transparent",
                marginBottom: 15,
                width: "100%",
            }}
            />

            <button
                onClick={() => {
                    navigator.clipboard.writeText(text);
                    alert("Copiado ✅");
                }}
                style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    marginBottom: 15,
                }}
            >
                📋 Copiar nota
            </button>

            <button
            onClick={() => {
                const blob = new Blob([text], { type: "text/plain" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `${active.title}.txt`;
                link.click();
            }}
            style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                marginBottom: 15,
                marginLeft: 10,
            }}
            >
            ⬇️ Descargar TXT
            </button>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{
                width: "100%",
                height: 400,
                padding: 15,
                borderRadius: 12,
                fontSize: 16,
              }}
            />

            <p style={{ opacity: 0.6 }}>Guardado automático ✅</p>
          </>
        )}
      </div>
    </div>
  );
}
