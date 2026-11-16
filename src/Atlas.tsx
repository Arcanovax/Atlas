
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface DashboardLayoutProps {
  user: AuthUser;
}

export default function DashboardLayout({
  user,
}: DashboardLayoutProps) {

	const [title, setTitle] = useState("");
  	const [content, setContent] = useState("");

  	const createNote = async () => {

		const response = await fetch(
		"/api/db/create_note.php",
		{
			method: "POST",
			headers: {
			"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify({
			title: title,
			content: content
			})
		}
		);

		const result = await response.json();

		console.log(result);

  	};

	const [notes, setNotes] = useState([]);

	const getNotes = async () => {

	const response = await fetch(
		"/api/db/get_notes.php",
		{
			credentials: "include"
		}
	);

	const data = await response.json();

	setNotes(data);

	};

  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={user} />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-blue-600">Atlas</p>
              <h1 className="mt-1 text-2xl font-bold text-gray-900">
                Hello, {user.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500">{user.email}</p>
            </div>

			<div>

				<input
					placeholder="Titre"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>

				<textarea
					placeholder="Contenu de la note"
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>

				<button onClick={createNote}>
					Enregistrer la note
				</button>

			</div>
				<button onClick={getNotes}>
				Charger mes notes
				</button>

				<div>
				{notes.map((note) => (
					<div key={note.id}>

					<h3>{note.title}</h3>

					<p>{note.content}</p>

					<small>{note.created_at}</small>

					</div>
				))}
				</div>

          </div>
        </main>
      </div>
    </div>
  );
}
