import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

const ErrorDialog = ({ open, message, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Lỗi!</DialogTitle>

            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Đóng</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ErrorDialog;
