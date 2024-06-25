import { useQuery } from "@tanstack/react-query";

import Book from "./book";
import { PulseLoader } from "react-spinners";

export interface BookProps {
  _id: number;
  body: string;
  completed: boolean;
  pages: number;
  readpages: number;
  percentage: number;
}

const fetchBooks = async (status: string) => {
  const res = await fetch(`/api/books?status=${status}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data || [];
};

interface BooksListProps {
  status: string;
}

const BooksList: React.FC<BooksListProps> = ({ status }) => {
  const { data: books, isLoading } = useQuery<BookProps[]>({
    queryKey: ["books", status],
    queryFn: () => fetchBooks(status),
  });

  return (
    <section className="flex flex-col items-center">
      <h1 className="text-4xl text-primary font-bold mb-6">Books List</h1>
      {isLoading && <PulseLoader color="#543310" />}
      {!isLoading && books?.length === 0 && (
        <h1 className="text-lg font-medium text-gray-900">
          There is no books on list!
        </h1>
      )}
      {books?.map((book) => (
        <Book key={book._id} book={book} />
      ))}
    </section>
  );
};

export default BooksList;
