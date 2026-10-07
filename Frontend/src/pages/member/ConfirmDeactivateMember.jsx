function ConfirmDeactivateMember({ onConfirm, onClose }) {

    return (
        <div className="modal-overlay" onClick={onClose}>

            <div className="page-container modal-form" onClick={(e) => e.stopPropagation()}            >

                <div className="form-header">
                    <h3>Deactivate Member</h3>

                    <button type="button" className="close-btn1" onClick={onClose}>×</button>
                </div>

                <p>Are you sure you want to deactivate this Member ?</p>

                <div style={{
                    marginLeft:'-10px'
                }}>
                    <button type="button" className="btn" onClick={onConfirm}>Yes, Deactivate</button>

                    <button type="button" className="btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
export default ConfirmDeactivateMember