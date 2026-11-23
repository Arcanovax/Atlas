import {type Folder, Note, Selection } from "../Atlas";
import { useState } from "react";

interface FolderPageProps {
	selectedFolder: Folder;
	notes: Note[];
	onCreateNote: (title: string, content: string) => void | Promise<void>;
	onDeleteNote: (id: string | number) => void | Promise<void>;
	onSelectionChange: (selection: Selection) => void;
}


export default function FolderPage({
	selectedFolder,
	notes,
	onCreateNote,
	onDeleteNote,
	onSelectionChange
}: FolderPageProps) {

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");


  	return (

	<div>
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

			<button type="button" onClick={() => onCreateNote(title, content)}>
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
					onClick={() => onDeleteNote(note.id)}
					>
					delete
					</button>
					<button
					className="text-blue-600"
					onClick={() => {
						if (selectedFolder) {
							onSelectionChange({
								kind: "note",
								folder: selectedFolder,
								note,
							});
						}
					}}
					>
					View
					</button>
				</div>
				))}
			</div>
	</div>

  )}
