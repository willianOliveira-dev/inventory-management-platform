import { FaHeart } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="md:col-start-2 bg-stone-950 shadow-[0px_-10px_15px_rgba(0,_0,_0,_0.5)] p-2 ">
            <p className=" flex items-center justify-center gap-2 bg-gradient-to-r bg-clip-text from-violet-400 via-violet-500 to-violet-700 text-transparent" >made with <FaHeart className="text-red-500"/> by Willian dos Santos Oliveira</p>
        </footer>
    );
}
