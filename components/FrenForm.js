import { ethers, providers } from "ethers";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';

export default function FrenForm({ frens, setFrens, filterFrens, contractAddress, contractAbi }) {

  const { register, handleSubmit, watch, resetField, formState: { errors } } = useForm();

  const onSubmit = async newFren => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer);
  
      // call contract's addFren function, return a new frenList
      console.log("adding fren");
      let tx = await contract.addfren(newFren.address, newFren.name);
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
      
      let frenList = filterFrens(rc);
      toast.dismiss(toastId);

      setFrens(frenList);
      resetField("name")
      resetField("address")
    } catch(error){
      console.error(error);
    }
  };

  return (
    <>
      <form 
        className="flex flex-col sm:flex-row justify-around mb-6"
        onSubmit={handleSubmit(onSubmit)}
        >
        <div className="text-center mb-2">
        <input 
          className="w-full rounded pl-2 sm:mb-0"
          placeholder="wat name" 
          {...register("name", {required: "name is required boo"})}
        />
        {errors.name && <p className="text-myred">{errors.name.message}</p>}
        </div>
        
        <div className="text-center mb-2">
        <input 
          className=" w-full rounded pl-2 sm:mb-0"
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