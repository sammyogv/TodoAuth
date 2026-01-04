import { useEffect, useState } from 'react';
import { MdDeleteOutline } from "react-icons/md";
import { FaDeleteLeft } from "react-icons/fa6";
import { Form } from 'react-router';

import logo from '../assets/logo.png';
import Nav from '../components/nav';
import { collection, query, onSnapshot, addDoc, doc, deleteDoc, updateDoc, where, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, auth } from '../utilities/firebase';
import { signOut,} from 'firebase/auth';
import { useAuth } from '../context/authContext';




export default function Todo() {

    const [todos, setTodos] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const todoCollRef= collection(db,'todos');
    const {credentials, loadings} = useAuth();

    const clearCompleted = async () => {
        const completedTodos = todos.filter(todo => todo.completed);
        await Promise.all(
            completedTodos.map(todo =>
            deleteDoc(doc(db, "todos", todo.id))
            )
        );
    };

    

    function handleLogout() {
        signOut(auth)
    }


    useEffect(() => {

        if (!credentials) {
            setTodos([]);
            return;
        }

        const q = query(todoCollRef, where("userID", "==", credentials.uid), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const todosArray = snapshot.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title,
                completed: doc.data().completed,
                userID: doc.data().userID,
            }));


            setTodos(todosArray);
            },
            (error) => {
            console.log(error.message);
            }
        );

        return () => unsubscribe(); // cleanup
    }, [credentials]); // 👈 VERY IMPORTANT

    const addTodo = async (e) => {
        e.preventDefault();

        setNewTitle("");

        if (!credentials) {
            alert("You must be logged in to add a todo.");
            return;
        }


        await addDoc(todoCollRef, 
            {title: newTitle, completed: false, userID: credentials.uid, createdAt: serverTimestamp()});
        
    }


    const deleteTodo = async (id) => {
        await deleteDoc(doc(db, "todos", id));
    };


    const handleCheck = async (id, currentStatus) => {
        const todoRef = doc(db, "todos", id);
        await updateDoc(todoRef, {completed: !currentStatus} )
    };


    return(
        <div className="w-screen h-screen flex flex-col bg-white items-center mb-5">

           {!credentials && <Nav/>}  
            <div className="w-full h-25 flex items-center justify-center bg-lightOrange ">
                <img src={logo} alt="Todo Logo" className="h-15 w-57.75 object-contain" />
                
            </div>
            

            <div className='w-screen h-18.25 bg-gray flex'  >
                <div className='w-1/2 h-full flex items-center justify-center border-r-2 border-none '>
                    <h1 className='font-poppins font-semibold text-[32px] '></h1>
                </div>
                <div className='w-1/2 h-full flex items-center justify-center '>
                    <h1 className='font-poppins font-semibold text-[32px] '></h1>
                </div>
            </div>

            <div className='w-[70%] bg-white flex flex-col items-center'>
                <Form onSubmit={addTodo} className='h-19.5 w-full overflow-hidden mt-10 flex'>
                     <input
                        type="text"
                        placeholder="What do you need to do?"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="h-full lg:text-[32px] md:text-[20px] sm:text-[12px] xs:text-[8px] border-none rounded-full w-[80%] bg-darkOrange px-6 py-4 text-sm text-gray-700 placeholder-gray-500 outline-none"
                    />
                    <button type='submit' className="h-full w-[25%] -ml-12.5 border-none rounded-r-full bg-lightBlue text-gray-700 font-semibold">Add</button>
                </Form>
                <div className='flex flex-col w-full bg-darkOrange h-contain border-none rounded-3xl mt-10'>
                    {todos.map((todo) => (
                        <div key={todo.id} className="flex-col py-2 px-4 border-b border-gray-200 flex">
                            <div className="flex items-center justify-between">
                                <div className='flex items-center justify-center'>
                                    <span
                                        className={`w-8 h-8 flex items-center justify-center rounded-full border-2 cursor-pointer mr-4 ${todo.completed ? 'border-orange-400 bg-orange-400' : 'border-orange-400'}`}
                                        onClick={() => handleCheck(todo.id, todo.completed)}
                                        >
                                        {todo.completed && (
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </span>
                                    <span className={`text-lg font-poppins font-regular lg:text-[32px] md:text-[20px] sm:text-[12px] ${todo.completed? 'line-through' : ''}`}>{todo.title}</span>
                                </div>
                            
                                <button className='text-orange-400 text-[32px] ' onClick={() => deleteTodo(todo.id)}><MdDeleteOutline /></button>
                            </div>
                            <hr className='w-full mt-4 text-gray-300' />
                        </div>

                    ))}
                    <div className='w-full bg-transparent flex justify-end px-10 mt-10'>
                        <div>
                            <button className='flex justify-center items-center text-[20px] text-orange-500 ' onClick={clearCompleted}><FaDeleteLeft /> clear completed</button>
                        </div>
                    </div>

                    {credentials && <button className='w-[30%] mx-auto relative  mt-10 mb-5 bg-lightBlue px-6 py-2 rounded-full text-gray-700 font-semibold' onClick={handleLogout}>
                        Logout
                    </button>}

                </div>
            </div>
        </div>
        
    )
}