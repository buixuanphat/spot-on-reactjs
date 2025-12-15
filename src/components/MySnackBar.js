import { Snackbar } from "@mui/joy";

const MySnackBar = ({message, open}) => {

    return (
        <Snackbar
            open={open}
            color="success"
            size="lg"
            variant="soft">
            {message}
        </Snackbar>
    );
}
export default MySnackBar;