import { useState, useRef, useEffect } from "react";

interface NewFolderButtonProps {
  onCreate: (name: string) => void | Promise<void>;
}

export default function NewFolderButton({ onCreate }: NewFolderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const cancel = () => {
    setIsOpen(false);
    setName("");
  };

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed || loading) return;
    try {
      setLoading(true);
      await onCreate(trimmed);
      cancel();
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit();
    if (e.key === "Escape") cancel();
  };

  const iconBtn =
    "flex h-8 w-8 shrink-0 items-center justify-center text-[#EEEDE7]";

  return (
    <div className="flex h-8 w-full items-center gap-1">
      {isOpen ? (
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Name"
          maxLength={255}
          className="h-8 min-w-0 flex-1 bg-transparent text-base font-semibold leading-8 text-[#EEEDE7] placeholder:text-[#62625E] outline-none"
        />
      ) : (
        <h1 className="min-w-0 flex-1 truncate text-base font-semibold leading-8 text-[#EEEDE7]">
          Folders
        </h1>
      )}
      {isOpen ? (
        <>
          <button onClick={cancel} className={iconBtn} aria-label="Cancel">
            <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
            </svg>
          </button>
          <button
            onClick={submit}
            disabled={!name.trim() || loading}
            className={`${iconBtn} disabled:text-[#62625E]`}
            aria-label="Create folder"
          >
            <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5"/>
            </svg>
          </button>
        </>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className={iconBtn}
          aria-label="New folder"
        >
          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5"/>
          </svg>
        </button>
      )}
    </div>
  );
}
