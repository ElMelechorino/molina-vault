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