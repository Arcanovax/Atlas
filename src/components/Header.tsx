import {type Folder, Note } from "../Atlas";

interface HeaderProps {
	selectedNote: Note | null;
	selectedFolder: Folder | null;
	onDeleteFolder: (id: string | number) => void | Promise<void>;
}


export default function Header({
	selectedNote,
	selectedFolder,
	onDeleteFolder
}: HeaderProps) {


  return (
    <header className="h-16 shrink-0 bg-[#0A0A09] border-b
                       border-[#282825] flex items-center
                       justify-between px-6 font-grotesk
					   text-[#62625E]">

	<h2 className="">
		Personnal Space {selectedFolder ? `/ ${selectedFolder.title}` : ''} {selectedNote ? `/ ${selectedNote.title}` : ''}
	</h2>
	{selectedFolder && (
		<button
		className=""
		onClick={() => onDeleteFolder(selectedFolder.id)}
		>
			<svg width="20" height="20" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M0 3.30001H13M4.33333 3.30001V0.700012H8.66667V3.30001M1.44444 3.30001L2.16667 13.7H10.8333L11.5556 3.30001M5.05556 5.90001V11.1M7.94444 5.90001V11.1" stroke="#62625E"/>
			</svg>
		</button>
	)}

    </header>
  );
}


