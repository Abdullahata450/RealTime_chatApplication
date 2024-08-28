import React from 'react';

function ConfirmationModal({ isOpen, onClose, onConfirm, user }) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <p>Do you want to add {user.fullname} to your messages?</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm}>Yes</button>
                    <button onClick={onClose}>No</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
