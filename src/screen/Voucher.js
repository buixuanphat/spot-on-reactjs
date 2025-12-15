import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { authApis, endpoints } from "../configs/Apis";
import { useContext, useEffect, useRef, useState } from "react";
import { Alert, CircularProgress, Stack, Table, Input } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { MyUserContext } from "../Contexts";

const Voucher = () => {

    const [vouchers, setVouchers] = useState([])

    const [openDialog, setOpenDialog] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    const [loading, setLoading] = useState(false);

    const user = useContext(MyUserContext);

    const [q, setQ] = useState('');


    const nav = useNavigate();

    const fetchVouchersByOrganizer = async () => {
        try {
            setLoading(true);
            let url = `${endpoints['getVouchersByOrganizer']}?organizerId=${user.organizer.id}&&code=${q}`
            let res = await authApis().get(url);
            setVouchers(res.data.data);
        }
        catch (e) {
            setErrorMessage(e.response?.data?.message || e.message)
            setOpenDialog(true);
        }
        finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchVouchersByOrganizer();
    }, [q]);


    const timeoutRef = useRef();

    return (
        <Box>
            <Stack direction={'row'}>
                <Input
                    placeholder="Tìm kiếm"
                    variant="soft"
                    onChange={(e) => {
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current)
                        }
                        timeoutRef.current = setTimeout(() => {
                            setQ(e.target.value);
                        }, 1000);
                    }}
                />


            </Stack>

            {loading && <CircularProgress />}
            {!loading && vouchers.length > 0 ?
                <Table
                    aria-label="basic table" borderAxis="both"
                    color="neutral"
                    size="lg"
                    stickyFooter={false}
                    stickyHeader
                    stripe="even"
                    hoverRow="true"
                    variant="outlined">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Mã</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(vouchers).map(v =>
                            <tr key={v.id} style={{ cursor: 'pointer' }} >
                                <td>{v.id}</td>
                                <td>{v.code}</td>
                            </tr>
                        )}
                    </tbody>
                </Table> :
                <Alert
                    color="danger"
                    size="md"
                    variant="soft"
                >Không tìm thấy mã giảm giá</Alert>

            }
    


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
