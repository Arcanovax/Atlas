
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";


export interface Folder {
  id: string | number;
  title: string;
}

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

	const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
	const [title, setTitle] = useState("");
  	const [content, setContent] = useState("");

	const [folders, setFolders] = useState<Folder[]>([]);

	const getFolders = async () => {
		const response = await fetch("/api/db/get_folders.php", {
			credentials: "include",
		});
		const data = await response.json();
		setFolders(data);
		return data;
	};


	const createFolder = async (name: string) => {
		const folder = await fetch("/api/db/create_folder.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ title: name }),
		});
		const folders = await getFolders();
		const newFolder = folders.find(
        	(folder) => folder.title === name
    	);
		if (newFolder) {
			setSelectedFolder(newFolder);
		}
		};


  	const createNote = async () => {

		await fetch(
		"/api/db/create_note.php",
		{
			method: "POST",
			headers: {
			"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify({
			title: title,
			content: content,
			parent_id: selectedFolder.id
			})
		}
		);
		getNotes();

  	};



	const deleteNote = async (id: number) => {

		const response = await fetch(
		"/api/db/delete_node.php",
		{
			method: "POST",
			headers: {
			"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify({
			id: id,
			})
		}
		);
		getNotes();
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

	const deleteFolder = async (id: Folder["id"]) => {
		await fetch("/api/db/delete_node.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ id }),
		});


		setSelectedFolder(null);


		await getFolders();
		await getNotes();
		};

	useEffect(() => {
		getFolders();
		getNotes();
	}, []);

  return (
    <div className="flex min-h-screen w-full bg-[#0A0A09]">
    <Sidebar
		user={user}
		folders={folders}
		selectedFolder={selectedFolder}
		onFolderSelect={setSelectedFolder}
		onCreateFolder={createFolder}
	/>
    <div className="flex min-w-0 flex-1 flex-col">
    <Header
		selectedFolder={selectedFolder}
		onDeleteFolder={deleteFolder}
	/>
	<main className="flex-1 p-6 text-[#EEEDE7]">
		<div className="space-y-6">
			<div>
				{selectedFolder && (
					<>
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
						<div>
						{notes
							.filter(
							(note) =>
								Number(note.parent_id) === Number(selectedFolder.id)
							)
							.map((note) => (
							<div className="py-5" key={note.id}>
								<h3>{note.title}</h3>
								<p>{note.content}</p>

								<button
								className="text-red-600"
								onClick={() => deleteNote(note.id)}
								>
								delete
								</button>
							</div>
							))}
						</div>
					</>
				)}
				{!selectedFolder && (
					<p className="mt-1 text-2xl font-bold text-gray-900">
						Select
					</p>
				)
				}

			</div>
		</div>
	</main>
    </div>
    </div>
  );
}
