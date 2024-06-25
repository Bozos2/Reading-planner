import { BookProps } from "./books-list";
import { useState } from "react";
import { FaCheckCircle, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { cn } from "../lib/utils";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const Book = ({ book }: { book: BookProps }) => {
  const [error, setError] = useState("");
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [newBookProgress, setNewBookProgress] = useState<string>("");
  const queryClient = useQueryClient();

  const handleShowData = () => {
    setShowDetail((prev) => !prev);
  };

  const handleShowEditForm = () => {
    setShowEditForm((prev) => !prev);
  };

  const { mutate: updateBook, isPending: isUpdating } = useMutation({
    mutationKey: ["updateBook"],
    mutationFn: async () => {
      if (book.completed) return setError("Book is already completed!");
      try {
        const res = await fetch(`/api/books/${book._id}`, {
          method: "PATCH",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const { mutate: removeBook, isPending: isDeleting } = useMutation({
    mutationKey: ["removeBook"],
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/books/${book._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const { mutate: updateReadPages, isPending: isUpdatingPages } = useMutation({
    mutationKey: ["updateReadPages"],
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      if (book.completed) return setError("Book is already completed!");
      if (Number(newBookProgress) > book.pages || Number(newBookProgress) < 0) {
        return setError("Error, set correct amount of readed pages!");
      }
      try {
        const res = await fetch(`/api/books/${book._id}/read`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ readpages: Number(newBookProgress) }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        setNewBookProgress("");
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  return (
    <div className="flex flex-col font-mirza">
      <div className="flex flex-row">
        <div className="flex flex-col bg-third rounded-md w-48 sm:w-80 p-2">
          <div className="flex flex-row justify-between">
            <h1 className="text-lg font-semibold text-primary truncate mr-1">
              {book.body}
            </h1>
            <button onClick={handleShowData} className="mt-0.5">
              {showDetail ? (
                <FaChevronUp size={20} className="text-gray-900" />
              ) : (
                <FaChevronDown size={20} className="text-gray-900" />
              )}
            </button>
          </div>
          {showDetail ? (
            <div className="mt-2 flex flex-col sm:flex-row justify-around items-center">
              <CircularProgressbar
                value={book.percentage}
                text={`${book.percentage}%`}
                className="!w-24 !h-24"
                styles={buildStyles({
                  textColor: "#543310",
                  pathColor: "#543310",
                  trailColor: "#F8F4E1",
                })}
              />
              <div className="flex flex-col font-sans items-center">
                <h1 className="font-semibold text-gray-900 mb-2 mt-2 sm:mt-0">
                  Status:{" "}
                  <span
                    className={cn(
                      "font-bold uppercase p-1 text-xs rounded-md",
                      {
                        "bg-green-500 text-green-800": book.completed,
                      },
                      {
                        "bg-yellow-300 text-yellow-600": !book.completed,
                      }
                    )}
                  >
                    {book.completed ? "Completed" : "In Progress"}
                  </span>
                </h1>
                <h1 className="font-semibold text-gray-900">Readed Pages:</h1>
                <h2 className="text-primary font-mirza text-lg font-bold">
                  {book.readpages | 0}{" "}
                  <span className="font-semibold text-gray-900">of</span>{" "}
                  {book.pages}
                </h2>
              </div>
            </div>
          ) : null}{" "}
          {showEditForm ? (
            <form
              className="mt-4 flex flex-row gap-2 items-center"
              onSubmit={updateReadPages}
            >
              <input
                type="number"
                name="book pages"
                value={newBookProgress}
                onChange={(e) => setNewBookProgress(e.target.value)}
                placeholder="Readed..."
                className="py-1 px-4 border border-primary rounded-md w-24 focus:outline-primary ml-2"
              />
              <p className="text-lg font-semibold text-gray-900">
                of <span className="text-primary">{book.pages}</span>
              </p>
              <button
                className="py-1 px-3 bg-primary text-white rounded-md hover:bg-opacity-90"
                type="submit"
                disabled={isUpdating || isDeleting || isUpdatingPages}
              >
                Save
              </button>
            </form>
          ) : null}
        </div>
        <button
          onClick={() => updateBook()}
          disabled={isUpdating || isDeleting || isUpdatingPages}
          className="text-white ml-1"
        >
          <FaCheckCircle
            size={32}
            className="text-green-600 hover:text-opacity-80"
          />
        </button>
        <button
          onClick={handleShowEditForm}
          disabled={isUpdating || isDeleting || isUpdatingPages}
        >
          <FaEdit
            size={32}
            className="text-gray-900 hover:text-opacity-80 ml-1"
          />
        </button>
        <button
          onClick={() => removeBook()}
          disabled={isUpdating || isDeleting || isUpdatingPages}
        >
          <MdDelete size={32} className="text-red-500 hover:text-opacity-80" />
        </button>
      </div>
      <p className="text-red-500 text-lg font-semibold my-2">{error}</p>
    </div>
  );
};

export default Book;
