import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { authApis, endpoints } from "../configs/Apis";
import { useEffect,  useState } from "react";
import { CircularProgress, Card, Typography, IconButton, Button } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyUserContext } from "../Contexts";
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';

const Voucher = ({ eventId }) => {
    const user = useContext(MyUserContext);

    const [vouchers, setVouchers] = useState([])
    const [allVouchers, setAllVouchers] = useState([])

    const [openDialog, setOpenDialog] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);

    const [q, setQ] = useState(null);

    const nav = useNavigate();


    const fetchVouchersByOrganizer = async () => {
        try {
            setLoading(true);
            let url = `${endpoints['getVouchersByOrganizer']}?organizerId=${user.organizer.id}`
            let res = await authApis().get(url);
            setAllVouchers(res.data.data);
            setAdding(true);
        }
        catch (e) {
            setErrorMessage(e.response?.data?.message || e.message)
            setOpenDialog(true);
        }
        finally {
            setLoading(false);
        }
    };

    const fetchVoucherByEvent = async () => {
        try {
            setLoading(true);
            let url = `${endpoints['getVouchersByEvent']}?eventId=${eventId}`;
            let res = await authApis().get(url);
            setVouchers(res.data.data);
            console.log(res.data);
        }
        catch (e) {
            setErrorMessage(e.response?.data?.message || e.message)
            setOpenDialog(true);
        }
        finally {
            setLoading(false);
        }
    };


    const addVoucherEvent = async (voucherId) => {
        try {
            let res = await authApis().post(endpoints['addVoucherEvent'], {
                voucherId: voucherId,
                eventId: eventId
            });

            if (res.status === 200) fetchVoucherByEvent();
        } catch (e) {
            setErrorMessage(e.response?.data?.message || e.message);
            setOpenDialog(true);
        }
    }


        const deleteVoucherEvent = async (id) => {
        try {
            let res = await authApis().delete(endpoints['deleteVoucherEvent'](id));
            console.log(id)
            console.log(res.status)
            console.log(res.data)

            if (res.status === 200) fetchVoucherByEvent();
        } catch (e) {
            setErrorMessage(e.response?.data?.message || e.message);
            setOpenDialog(true);
        }
    }



    useEffect(() => {
        fetchVoucherByEvent();
    }, []);





    return (
        <Box>


            {loading && <CircularProgress />}
            <Button startDecorator={<AddIcon />} onClick={fetchVouchersByOrganizer} >
                Thêm
            </Button>
            {vouchers.map(v =>
                <Card key={v.id} sx={{ width: '50%' }} variant="soft" color="success">
                    <Typography level="title-lg">{v.voucher.code}</Typography>
                    <Typography level="body-sm">{v.voucher.description}</Typography>
                    <IconButton
                        aria-label="bookmark Bahamas Islands"
                        variant="plain"
                        color="danger"
                        size="sm"
                        sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}
                        onClick={()=>deleteVoucherEvent(v.id)}
                    >
                        <DeleteForeverIcon fontSize="medium" />
                    </IconButton>
                </Card>
            )}


            {adding && allVouchers.map(v =>
                <Card key={v.id} sx={{ width: '50%' }} variant="soft" color="primary">
                    <Typography level="title-lg">{v.code}</Typography>
                    <Typography level="body-sm">{v.description}</Typography>
                    <IconButton
                        aria-label="bookmark Bahamas Islands"
                        variant="soft"
                        color="primary"
                        size="sm"
                        sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}
                        onClick={() => addVoucherEvent(v.id)}
                    >
                        <AddBoxIcon  />
                    </IconButton>
                </Card>
            )}

            <Dialog
                open={openDialog}
                onClose={() => { setOpenDialog(false) }}
            >
                <DialogTitle>
                    Lỗi!
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {errorMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenDialog(false) }}>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
export default Voucher;
