import { ethers, providers } from "ethers";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';

export default function FrenForm({ frens, setFrens, contractAddress, contractAbi }) {
  const [waiting, setWaiting] = useState(false);
  const { register, handleSubmit, watch, resetField, formState: { errors } } = useForm();

  const onSubmit = async newFren => {
    if (waiting) {
      toast.error('plz wait for last txn to be confirmed');
      return;
    }

    if (frens.length + 1 >= 20) {
      toast.error('20 friends max mate');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer);
  
      // call contract's addFren function, return a new frenList
      console.log("adding fren");
      let tx = await contract.addFren(newFren.address, newFren.name);
      setWaiting(true);
      const toastId = toast((t) => (
        <div>
            {'adding '}
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-br bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500">
              {newFren.name}
            </span>
            {' to de blockchain...'}
        </div>
      ))
      
      const rc = await tx.wait();
      const frenList = rc.events.find(event => event.event === "FrenListUpdated").args._frenlist;
      setFrens(frenList);
      setWaiting(false);
      toast.dismiss(toastId);

      resetField("name");
      resetField("address");

    } catch(error){
      console.error(error);
    }
  };

  return (
    <>
      <form 
        className="flex flex-col sm:flex-row justify-around items-center mb-6"
        onSubmit={handleSubmit(onSubmit)}
        >
        <div className="text-center mb-2 sm:mb-0">
        <input 
          className="w-full rounded pl-2"
          placeholder="wat name" 
          {...register("name", {required: "this required mane"})}
        />
        {errors.name && <p className="text-myred">{errors.name.message}</p>}
        </div>
        
        <div className="text-center mb-2 sm:mb-0">
        <input 
          className=" w-full rounded pl-2"
          placeholder="wallet address" 
          {...register("address", 
            { 
              required: "address is required mane", 
              minLength: {
                value: 42,
                message: "needs 2b 42 chars"
              }, 
              maxLength: {
                value: 42,
                message: "needs 2b 42 chars"
              },
              // check that new fren isn't already on frenlist
              validate: address => frens.some( fren => fren['pubkey'] === address ) === false
            },
          )} 
        />
        {/* errors will return when field validation fails  */}
        {errors.address?.type === "required" && <p className="text-myred">this required mane</p>}
        {(errors.address?.type === "minLength" || errors.address?.type === "maxLength") && <p className="text-myred">this needs 2b 42 chars</p>}
        {errors.address?.type === "validate" && <p className="text-myred">ser, this is already a fren</p>}
        </div>

        <input 
          className="rounded-full p-2 bg-rose-500 hover:text-white hover:bg-rose-700 cursor-pointer"
          type="submit" 
          value="add fren"
        />
      </form>
      </>
  )
}