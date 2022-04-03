import { ethers, providers } from "ethers";
import QRCode from "react-qr-code";
import toast from 'react-hot-toast';

export default function FrenList ({ frens, setFrens, filterFrens, contractAddress, contractAbi }) {
    
    const deleteFren = async (address, name) => {
        try {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer);
        
            // call contract's removefren function, return a new frenList 
            console.log("removing fren");
            let tx = await contract.removefren(address);
            const toastId = toast((t) => (
                <div>
                    {'removing '}
                    <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-br bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500">
                        {name}
                    </span>
                    {' from de blockchain...'}
                </div>
            ));
            const rc = await tx.wait();
        
            // filter out zeroed out frens
            let frenList = filterFrens(rc);
            toast.dismiss(toastId);

            setFrens(frenList);
        } catch(error) {
            toast.error('sumthing went wrong :/')
            console.error(error);
        }

      };

    return (
        <>
        {frens.map((fren) =>
            <div 
                className="flex mb-6 p-4 rounded bg-white/[.4]"
                key={fren.pubkey}
                >
                <QRCode size={150} value={fren.pubkey} />
                <div className="flex flex-col items-center justify-around grow">
                <h2 className="text-l sm:text-xl mb-2 font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-br bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500">
                    {fren.name}
                </h2>
                <div className="flex items-center px-4">
                    <h6 className="mr-4">
                    {fren.pubkey.substring(0, 4) + '..' + fren.pubkey.substring(40, 42)}
                    </h6>
                    <button 
                    className="bg-white rounded px-1 sm:p-1 border-2 border-black hover:bg-slate-100"
                    onClick={() =>  navigator.clipboard.writeText(fren.pubkey)}
                    >
                        👈 copy
                    </button>
                </div>
                <button 
                    className="bg-rose-500 hover:bg-red-700 text-white text-center py-2 px-4 rounded-full"
                    onClick={() => deleteFren(fren.pubkey, fren.name)}
                >
                    remove fren
                </button>
                </div>
            </div>
            )}
        </>
    )
}