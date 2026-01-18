import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { authApis, endpoints } from "../configs/Apis";
import { useEffect, useState } from "react";
import { CircularProgress, Typography, Alert } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyUserContext } from "../Contexts";
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import { MyColor } from "../configs/Enum";
import { Button as AntButton, Button, Divider } from 'antd'
import { CheckCircleFilled, DeleteFilled, PlusOutlined } from "@ant-design/icons";

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

            const url = `${endpoints['getVouchersByOrganizer']}?organizerId=${user.organizer.id}`;
            const res = await authApis().get(url);

            setAllVouchers(res.data.data);
            setAdding(true);
        } catch (e) {
            setErrorMessage(e.response?.data?.message || e.message);
            setOpenDialog(true);
        } finally {
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


    const [filteredVouchers, setFilteredVouchers] = useState([]);

    useEffect(() => {
        const value = allVouchers.filter(av =>
            !vouchers.some(v => v.voucher.code === av.code)
        );
        setFilteredVouchers(value);
    }, [allVouchers, filteredVouchers]);





    useEffect(() => {
        fetchVoucherByEvent();
    }, []);





    return (
        <Box>

            {loading && <CircularProgress />}
            {vouchers.map(v =>
                <div
                    key={v.id}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    variant="soft"
                    color="success">
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                            opacity: 0.8,
                            width: '50%',
                            borderRadius: 10,
                            padding: 10,
                            margin: 10,
                            backgroundColor: MyColor.success

                        }}
                    >
                        <div style={{ marginTop: 8 }}>
                            <div style={{
                                display: 'inline-block',
                                padding: '6px 16px',
                                backgroundColor: MyColor.pinkLight,
                                border: '2px dashed #d32f2f',
                                borderRadius: '8px',
                                marginBottom: '8px'
                            }}>
                                <Typography
                                    level="title-lg"
                                    sx={{
                                        color: MyColor.redError,
                                        fontFamily: 'monospace',
                                        fontWeight: '800',
                                        letterSpacing: '2px'
                                    }}
                                >
                                    {v.voucher.code}
                                </Typography>
                            </div>

                            <Typography
                                level="body-sm"
                                sx={{
                                    color: 'black',
                                    opacity: 0.8,
                                    fontWeight: '500',
                                    lineHeight: 1.4,
                                    display: 'block'
                                }}
                            >
                                {v.voucher.description}
                            </Typography>
                        </div>
                    </div>

                    <Button color="red" variant="solid" icon={<DeleteFilled />} style={{ margin: 10 }} onClick={() => deleteVoucherEvent(v.id)}>Xóa</Button>
                </div>
            )}

            {!adding &&
                <div style={{ display: 'flex', justifyContent: 'center' }}  >
                    <Button style={{ marginTop: '10px' }} variant="solid" color="primary" icon={<AddIcon />} onClick={fetchVouchersByOrganizer} >
                        Thêm
                    </Button>
                </div>

            }

            {adding && <Divider sx={{ mt: 10 }}> Danh sách mã giảm giá:  </Divider>}


            {(adding && filteredVouchers.length > 0) && filteredVouchers.map(v =>
                <div
                    key={v.id}
                    sx={{ width: '50%' }}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    variant="soft"
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                            opacity: 0.8,
                            width: '50%',
                            borderRadius: 10,
                            padding: 10,
                            margin: 10,
                            backgroundColor: MyColor.primary

                        }}
                    >
                        <div style={{ marginTop: 8 }}>
                            <div style={{
                                display: 'inline-block',
                                padding: '6px 16px',
                                backgroundColor: MyColor.pinkLight,
                                border: '2px dashed #d32f2f',
                                borderRadius: '8px',
                                marginBottom: '8px'
                            }}>
                                <Typography
                                    level="title-lg"
                                    sx={{
                                        color: MyColor.redError,
                                        fontFamily: 'monospace',
                                        fontWeight: '800',
                                        letterSpacing: '2px'
                                    }}
                                >
                                    {v.code}
                                </Typography>
                            </div>

                            <Typography
                                level="body-sm"
                                sx={{
                                    color: 'white',
                                    opacity: 0.8,
                                    fontWeight: '500',
                                    lineHeight: 1.4,
                                    display: 'block'
                                }}
                            >
                                {v.description}
                            </Typography>
                        </div>
                    </div>

                    <Button color="primary" variant="solid" icon={<PlusOutlined />} style={{ margin: 10 }} onClick={() => addVoucherEvent(v.id)}>Thêm</Button>
                </div>
            )}

            {adding && filteredVouchers.length == 0
                &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Alert
                        color="danger"
                        size="md"
                        variant="soft"
                        sx={{ width: '50%', margin: '20px' }}
                    >Không tìm thấy mã giảm giá</Alert>
                </div>
            }


            {adding &&
                <div style={{ display: 'flex', justifyContent: 'center' }}  >
                    <Button style={{ marginTop: '10px', marginBottom: '10px' }} variant='solid' color='green' icon={<CheckCircleFilled />} onClick={() => setAdding(false)} >
                        Xong
                    </Button>
                </div>

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
