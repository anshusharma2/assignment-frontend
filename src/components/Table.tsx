import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { convertToDateString } from "../Helpers/Date";
import LoadingSkelton from "./LoadingSkelton";

export default function Table({}) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isPreviousData } = useQuery(
    ["getUsersTransaction", page],
    async () => {
      const { data } = await axios.get(
        `http://localhost:8000/api/getalltransactions?page=${page}`
      );
      return data;
    },
    {
      keepPreviousData: true,
    }
  );
  console.log(data);
  if (isLoading) {
    return <LoadingSkelton />;
  }
  return (
    <>
      {data?.transactions.length > 0 ? (
        <>
          <table className="w-full text-sm text-left text-black ">
            <thead className="text-base">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Sr.no
                </th>
                <th scope="col" className="px-6 py-3">
                  Address
                </th>
                <th scope="col" className="px-6 py-3">
                  BlockNumber
                </th>
                <th scope="col" className="px-6 py-3">
                  BlockHash
                </th>
              </tr>
            </thead>
            <tbody>
              {!isLoading &&
                data?.transactions.length > 0 &&
                data.transactions.map((transaction: any, index: number) => {
                  return (
                    <tr key={index} className={`border-t border-[#3D3C3C]`}>
                      <td className="px-6 py-4">
                        {index + 1 + (page - 1) * 10}
                      </td>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium  whitespace-nowrap "
                      >
                        {transaction.address}
                      </th>
                      <td className="px-6 py-4 ">{transaction.blockNumber}</td>
                      <td className="px-6 py-4">{transaction.blockHash}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <nav aria-label="Page navigation example" className="my-4 mx-4 block">
            <ul className="inline-flex items-center -space-x-px">
              <li>
                <button
                  onClick={() => setPage((old) => Math.max(old - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-2 leading-tight text-sm text-white font-bold bg-gray-900 rounded-lg  rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:text-white disabled:bg-gray-600"
                >
                  Previous
                </button>
              </li>
              <div className="flex gap-2 px-3">
                {data?.transactions &&
                  [...Array(Math.ceil(data.totalPages))].map((_, index) => {
                    return (
                      <li key={index + 1}>
                        <button
                          className={`px-3 py-2 leading-tight text-sm text-white font-bold bg-transparent rounded-lg hover:bg-gray-600 disabled:cursor-not-allowed disabled:text-white disabled:bg-gray-600`}
                          disabled={page === index + 1}
                          onClick={() => setPage(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    );
                  })}
              </div>
              <li>
                <button
                  onClick={() => {
                    if (!isPreviousData) {
                      setPage((old) => old + 1);
                    }
                  }}
                  disabled={data?.totalPages === page}
                  className="px-3 py-2 leading-tight text-sm text-white font-bold bg-gray-900 rounded-lg  rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:text-white disabled:bg-gray-600"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </>
      ) : (
        <div className="text-center text-white text-2xl">
          No transactions yet
        </div>
      )}
    </>
  );
}
