import { type ReportCardView } from '../../types';


export default function ReportCardView({ label, data, description, icon }: ReportCardView<string>) {
    return (
        <div className="flex justify-between items-center w-full  z-10 text-white p-4 bg-stone-950 shadow-[0_0_15px_0_rgba(0,0,0,1)] hover:scale-101 duration-300 ease-in rounded-2xl ">
            <div className="flex flex-col gap-1/2 p-2">
                <h3 className='tracking-tighter'>{label}</h3>
                <p className='text-xl font-bold text-cyan-400'>{data}</p>
                <p className='text-xs'>{description}</p>
            </div>
            <div className='w-7 h-7  rounded-full overflow-hidden'>{icon}</div>
        </div>
    );
}
