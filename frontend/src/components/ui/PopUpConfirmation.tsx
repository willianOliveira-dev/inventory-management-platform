import { BsQuestionOctagon } from 'react-icons/bs';
import { type PopUpConfirmation } from '../../types';

export default function PopUpConfirmation({
    message,
    setShowPopUp,
    onConfirm,
}: PopUpConfirmation) {
    return (
        <div className="flex justify-center items-center fixed inset-0 bg-black/80 z-50">
            <div className="flex flex-col gap-2 w-full max-w-80 md:max-w-100 rounded-md p-5 bg-white">
                <BsQuestionOctagon className="text-5xl text-red-500 self-center" />
                <div>
                    <h2 className="font-bold">Confirmar remoção?</h2>
                    <p className="text-sm text-gray-600">{message}</p>
                </div>
                <div className="flex flex-col gap-4  md:flex-row md:justify-end ">
                    <button
                        onClick={() => {
                            setShowPopUp(false);
                        }}
                        className="p-2 ring ring-gray-700/40 md:p-3 rounded-md cursor-pointer hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="text-white p-2 md:p-3 rounded-md cursor-pointer bg-red-500 hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        Remover
                    </button>
                </div>
            </div>
        </div>
    );
}
