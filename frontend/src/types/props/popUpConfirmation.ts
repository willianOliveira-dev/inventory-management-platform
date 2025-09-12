import React from 'react';

export interface PopUpConfirmation {
    message: string;
    setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
    onConfirm: () => void;
}
