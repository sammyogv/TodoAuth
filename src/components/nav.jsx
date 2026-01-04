import { Link } from "react-router"



export default function Nav(){



    return(
        
        <div className='w-screen h-18.25 bg-orange-500 flex mb-10 items-center justify-center'  >
            <Link to="/Login" className="flex-1 text-black text-center">Login</Link>
            <Link to="/Signup" className="flex-1 text-black text-center">Signup</Link>
        </div>
    )
}

