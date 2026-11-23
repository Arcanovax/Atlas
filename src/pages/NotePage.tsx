import {type Folder, Note, Selection } from "../Atlas";
import { useState, useEffect } from "react";

interface NotePageProps {
	selectedNote: Note;
}


export default function NotePage({
	selectedNote
}: NotePageProps) {

	return (
		<div>
		<p className="mt-1 text-2xl font-bold text-gray-900">
			{selectedNote.title}
		</p>
		{selectedNote.content}
		</div>
	)}
