
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import FolderPage from "./pages/FolderPage";
import NotePage from "./pages/NotePage";


export interface Folder {
  id: string | number;
  title: string;
}

export interface Note {
  id: string | number;
  title: string;
  content: string;
  parent_id: string | number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export type Selection =
  | { kind: "folder"; folder: Folder }
  | { kind: "note"; folder: Folder; note: Note }
  | null;

interface DashboardLayoutProps {
  user: AuthUser;
}

export default function DashboardLayout({
  user,
}: DashboardLayoutProps) {
	const [selection, setSelection] = useState<Selection>(null);
	const selectedFolder = selection?.folder ?? null;
	const selectedNote = selection?.kind === "note" ? selection.note : null;



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
		await fetch("/api/db/create_folder.php", {
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
			setSelection({ kind: "folder", folder: newFolder });
		}
	};


  	const createNote = async (title: string, content: string, parentId?: string | number) => {
		const targetFolderId = parentId ?? selectedFolder?.id;
		if (targetFolderId === undefined) {
			return;
		}

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
			parent_id: targetFolderId
			})
		}
		);
		const notes = await getNotes();
		const newNote = notes.find(
        	(note) => note.title === title
    	);
		if (newNote) {
			setSelection({
				kind: "note",
				folder: folders.find((folder) => String(folder.id) === String(targetFolderId)) ?? selectedFolder!,
				note: newNote,
			});
		}
		};


	const deleteNote = async (id: Note["id"]) => {

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
		)
		await getNotes();
		setSelection((current) =>
			current?.kind === "note"
				? { kind: "folder", folder: current.folder }
				: current
		);
  	};

	const [notes, setNotes] = useState<Note[]>([]);

	const getNotes = async () => {

		const response = await fetch(
			"/api/db/get_notes.php",
			{
				credentials: "include"
			}
		);

		const data = await response.json();
		setNotes(data);
		return data
	};

	const deleteFolder = async (id: Folder["id"]) => {
		await fetch("/api/db/delete_node.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ id }),
		});


		setSelection(null);



		await getFolders();
		await getNotes();
		};

	const renameFolder = async (id: Folder["id"], title: string) => {
		await fetch("/api/db/rename_node.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ id, title }),
		});
		await getFolders();
	};

	const renameNote = async (id: Note["id"], title: string) => {
		await fetch("/api/db/rename_node.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ id, title }),
		});
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
		notes={notes}
		selection={selection}
		onSelectionChange={setSelection}
		onCreateFolder={createFolder}
		onRenameFolder={renameFolder}
		onRenameNote={renameNote}
		onDeleteFolder={deleteFolder}
		onDeleteNote={deleteNote}
	/>
    <div className="flex min-w-0 flex-1 flex-col">
    <Header
		selectedNote={selectedNote}
		selectedFolder={selectedFolder}
		onDeleteFolder={deleteFolder}
		onDeleteNote={deleteNote}
		onSelectionChange={setSelection}
	/>
	<main className="flex-1 p-6 text-[#EEEDE7]">
		<div className="space-y-6">
			<div>
				{selectedFolder && !selectedNote && (
					<FolderPage
					notes={notes}
					selectedFolder={selectedFolder}
					onDeleteNote={deleteNote}
					onCreateNote={createNote}
					onSelectionChange={setSelection}
					/>
				)}
				{selectedFolder && selectedNote && (
					<NotePage
					selectedNote={selectedNote}
					/>
				)
				}

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
