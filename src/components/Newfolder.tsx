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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-lg font-medium text-gray-700 transition hover:bg-gray-200"
      >
        +
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white p-2 shadow-sm">
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nom du dossier"
        maxLength={255}
        className="w-48 rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <button
        onClick={submit}
        disabled={!name.trim() || loading}
        className="rounded bg-blue-600 px-3 py-1 text-sm text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Valider
      </button>
      <button
        onClick={cancel}
        className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 transition hover:bg-gray-200"
      >
        Annuler
      </button>
    </div>
  );
}
