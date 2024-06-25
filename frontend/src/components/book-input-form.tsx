import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { IoMdAdd } from "react-icons/io";

interface BookInputFormProps {
  isProgress: boolean;
}

const BookInputForm: React.FC<BookInputFormProps> = ({ isProgress }) => {
  const [newBook, setNewBook] = useState("");
  const [newBookPages, setNewBookPages] = useState<string>("");
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const { mutate: createBook, isPending: isCreating } = useMutation({
    mutationKey: ["createBook"],
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const res = await fetch("/api/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: newBook, pages: Number(newBookPages) }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        setNewBookPages("");
        setNewBook("");
        return data;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  return isProgress ? (
    <>
      <form className="flex flex-row" onSubmit={createBook}>
        <input
          type="text"
          name="book name"
          value={newBook}
          onChange={(e) => setNewBook(e.target.value)}
          placeholder="Enter the Book name..."
          className="py-2 px-4 border border-primary rounded-md w-40 sm:w-80 focus:outline-primary"
        />
        <input
          type="number"
          name="book pages"
          value={newBookPages}
          onChange={(e) => setNewBookPages(e.target.value)}
          placeholder="Pages..."
          className="py-2 px-4 border border-primary rounded-md w-20 sm:w-28 focus:outline-primary ml-1 sm:ml-2"
        />
        <button
          type="submit"
          disabled={isCreating}
          className="rounded-md bg-primary py-2 px-3 sm:px-4 hover:bg-opacity-90 text-white ml-0.5"
        >
          <IoMdAdd size={24} />
        </button>
      </form>
      <p className="text-red-500 text-lg mt-4">{error}</p>
    </>
  ) : null;
};

export default BookInputForm;
