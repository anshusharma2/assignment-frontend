import Navbar from "./components/Navbar";
import { Formik, Form, Field, useFormik } from "formik";
import * as Yup from "yup";
import { ethers } from "ethers";
import { RootState } from "./store/store";
import { useSelector } from "react-redux";
import { Contract } from "ethers";
import abi from "./abi.json";
import { useWeb3ModalProvider } from "@web3modal/ethers5/react";
import { parseUnits } from "ethers/lib/utils";
import Table from "./components/Table";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

const App = () => {
  const walletaddress = useSelector(
    (state: RootState) => state.wallet.walletaddress
  );
  const SignupSchema = Yup.object().shape({
    amount: Yup.number().required("Required"),
  });
  const { walletProvider } = useWeb3ModalProvider();
  const { handleSubmit, errors, touched, values, handleChange } = useFormik({
    initialValues: {
      amount: 0,
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      console.log(values);
      getBalance();
    },
  });
  async function getBalance() {
    try {
      // Connect to the MetaMask EIP-1193 object. This is a standard
      // protocol that allows Ethers access to make all read-only
      // requests through MetaMask.
      // @ts-ignore
      let provider = new ethers.providers.Web3Provider(walletProvider);

      // It also provides an opportunity to request access to write
      // operations, which will be performed by the private key
      // that MetaMask manages for the user.
      let signer = provider.getSigner();
      let balance = await provider.getBalance(walletaddress);
      console.log(balance);

      let contract = new Contract(
        "0xe851dc85d7e274DE7b9e3AC077C5C1AEF7BbA479",
        abi,
        signer
      );
      console.log(contract);
      let amount = parseUnits(String(values.amount), 18);
      console.log(amount.toString(),"amount");
      
      // // Send the transaction
      let tx = await contract.mint(
        "0xe380a93db38f46866fdf4ca86005cb51cc259771",
        amount
      );
      await tx.wait();
      console.log(tx);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <div className="flex justify-center items-center flex-col">
        <div className="d-flex m-5">
          <form onSubmit={handleSubmit} className="">
            <div>
              <label
                htmlFor="first_name"
                className="block mb-2 text-xl font-medium text-gray-900 dark:text-white"
              >
                Please Enter amount to mint !
              </label>
              <input
                value={values.amount}
                name="amount"
                onChange={handleChange}
                type="text"
                id="first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="John"
                required
              />
            </div>
            <input />
            {errors.amount && touched.amount ? (
              <p className="text-red-900">Enter a Valid Number</p>
            ) : null}
            <button
              type="submit"
              className="text-white my-4 bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Mint
            </button>
          </form>
        </div>
      </div>
      <Table/>
      </QueryClientProvider>
  );
};

export default App;
