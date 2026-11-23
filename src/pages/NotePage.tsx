import {type Folder, Note } from "../Atlas";
import { useState } from "react";

interface NotePageProps {
	selectedNote?: Note;
	selectedFolder?: Folder;
	onCreateNote?: (title: string, content: string, parentId: string | number) => void | Promise<void>;
}


export default function NotePage({
	selectedNote,
	selectedFolder,
	onCreateNote
}: NotePageProps) {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	if (selectedFolder && onCreateNote) {
		return (
			<div className="px-10 py-1">
				<h1 className="font-bebas text-7xl">New note</h1>
				<input
					className="mt-4 w-full border-t"
					placeholder="Title"
					value={title}
					onChange={(event) => setTitle(event.target.value)}
				/>
				<textarea
					className="mt-4 w-full border-t"
					placeholder="Content"
					value={content}
					onChange={(event) => setContent(event.target.value)}
				/>
				<button
				className=""
					type="button"
					onClick={() => {
						if (title.trim()) {
							void onCreateNote(title.trim(), content, selectedFolder.id);
						}
					}}
				>
					Save the note
				</button>
			</div>
		);
	}

	if (!selectedNote) {
		return null;
	}

	return (
		<div className="px-10 py-1">
		<p className="text-4xl font-bold text-[#b7b7b0]">
			{selectedNote.title}
		</p>
		<p className="text-2xl pt-3">
			{selectedNote.content}
		</p>

		</div>
	)}
