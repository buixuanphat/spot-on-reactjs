import { Alert, AspectRatio, Box, Card, CardContent, DialogTitle, Typography } from "@mui/joy";
import { Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import { useEffect, useState } from "react";
import { authApis, endpoints } from "../configs/Apis";
import { MyUserContext } from "../Contexts";
import { useContext } from "react";
import { Add } from "@mui/icons-material";
import { Button, Divider } from "antd";
import { CheckCircleFilled, DeleteFilled, DeleteOutlined } from "@ant-design/icons";
import AddButton from "./AddButton";

const Merchandise = ({ eventId }) => {

    const [merchandises, setMerchandises] = useState([])
    const [loading, setLoading] = useState(false);
    const [loadingAll, setLoadingAll] = useState(false);
    const [page, setPage] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const user = useContext(MyUserContext);
    const [adding, setAdding] = useState(false);
    const [allMerchandises, setAllMerchandises] = useState([]);


    const fetchAllMerchandises = async () => {
        try {
            setLoadingAll(true);
            let res = await authApis().get(endpoints['getMerchandises'], {
                params: {
                    'organizerId': user.organizer.id
                }
            });
            setAllMerchandises(res.data.data.content);
        }
        catch (e) {
            setErrorMessage(e.response?.data?.message || e.message)
            setOpenDialog(true);
        }
        finally {
            setLoadingAll(false);
        }
    };

    const fetchEventMerchandise = async () => {
        try {
            setLoading(true);
            let res = await authApis().get(endpoints['getEventMerchandises'], {
                params: {
                    'eventId': eventId
                }
            });
            setMerchandises(res.data.data);
        }
        catch (e) {
            setErrorMessage(e.response?.data?.message || e.message)
            setOpenDialog(true);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEventMerchandise();
    }, []);



    const createEventMerchandise = async (merchandiseId) => {
        try {
            let res = await authApis().post(endpoints.createEventMerchandise,
                {
                    "eventId": eventId,
                    "merchandiseId": merchandiseId
                }
            );

            if (res.status === 200) fetchEventMerchandise();

        }
        catch (e) {
            setErrorMessage(e.response?.data?.message || e.message)
            setOpenDialog(true);
        }
    }



    const deleteEventMerchandise = async (id) => {
        try {
            let res = await authApis().delete(endpoints['deleteEventMerchandise'](id));
            if (res.status === 200) fetchEventMerchandise();
        }
        catch (e) {
            setErrorMessage(e.response?.data?.message || e.message)
            setOpenDialog(true);
        }
    }


    const [fileredMerchandise, setFilteredMerchandise] = useState([]);

    useEffect(() => {
        const value = allMerchandises.filter(am =>
            !merchandises.some(m => m.merchandise.id === am.id)
        );
        setFilteredMerchandise(value);
    }, [fileredMerchandise, allMerchandises]);


    return (
        <Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    mt: 5,
                    gap: 5,
                    marginBottom: '30px'
                }}>
                {merchandises.length > 0 && merchandises.map(m =>
                    <Card
                        variant="outlined"
                        key={m.id}
                        sx={{
                            width: 320,
                            overflow: 'hidden',
                            borderRadius: '16px',
                            border: '1px solid #eee'
                        }}
                    >
                        <div style={{ padding: '12px 12px 0 12px', position: 'relative' }}>
                            <Typography
                                level="body-xs"
                                sx={{
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold',
                                    color: 'success.600',
                                    mb: 0.5
                                }}
                            >
                                Official Merchandise
                            </Typography>

                            <Typography level="title-lg" sx={{ pr: 4, mb: 1 }}>
                                {m.merchandise.name}
                            </Typography>

                            <Button
                                variant="solid"
                                color="danger"
                                size="sm"
                                style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                }}
                                onClick={() => deleteEventMerchandise(m.id)}
                                icon={<DeleteFilled />}
                            >
                                Xóa
                            </Button>
                        </div>

                        <div style={{ position: 'relative', margin: '0 12px' }}>
                            <AspectRatio ratio="1/1" sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                                <img
                                    src={m.merchandise.image}
                                    loading="lazy"
                                    alt={m.merchandise.name}
                                    style={{ objectFit: 'cover' }}
                                />
                            </AspectRatio>
                        </div>

                        <CardContent sx={{ p: 2 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Typography sx={{ fontSize: 'sm', opacity: 0.6 }}>Giá bán:</Typography>
                                    <Typography sx={{ fontSize: 'xl', fontWeight: '800', color: '#1A1A1A' }}>
                                        {m.merchandise.price.toLocaleString("vi-VN")} <span style={{ fontSize: 14 }}>đ</span>
                                    </Typography>
                                </div>
                            </div>
                        </CardContent>
                    </Card>)}
            </Box>

            {!adding &&
                <AddButton onClick={() => {
                    fetchAllMerchandises();
                    setAdding(true);
                }} />
            }

            {adding && <Divider sx={{ mt: 10 }}> Danh sách đồ lưu niệm:  </Divider>}


            {adding && <Button icon={<CheckCircleFilled />} variant="solid" color="green" onClick={() => { setAdding(false) }} >Xong</Button>}



            {adding &&
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    mt: 5,
                    gap: 5
                }}>
                    {allMerchandises.length > 0 && fileredMerchandise.map(m =>

                        <Card
                            variant="outlined"
                            key={m.id}
                            sx={{
                                width: 320,
                                overflow: 'hidden',
                                borderRadius: '16px',
                                border: '1px solid #eee',
                            }}>
                            <div style={{ padding: '12px 12px 0 12px', position: 'relative' }}>
                                <Typography
                                    level="body-xs"
                                    sx={{
                                        textTransform: 'uppercase',
                                        fontWeight: 'bold',
                                        color: 'success.600',
                                        mb: 0.5
                                    }}
                                >
                                    Official Merchandise
                                </Typography>

                                <Typography level="title-lg" sx={{ pr: 4, mb: 1 }}>
                                    {m.name}
                                </Typography>

                                <Button
                                    variant="solid"
                                    color="primary"
                                    size="sm"
                                    sx={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                    }}
                                    icon={<Add />}
                                    onClick={() => createEventMerchandise(m.id)}
                                >
                                    Thêm
                                </Button>
                            </div>


                            <div style={{ position: 'relative', margin: '0 12px' }}>
                                <AspectRatio ratio="1/1" sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                                    <img
                                        src={m.image}
                                        loading="lazy"
                                        alt={m.name}
                                        style={{ objectFit: 'cover' }}
                                    />
                                </AspectRatio>
                            </div>

                            <CardContent sx={{ p: 2 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <Typography sx={{ fontSize: 'sm', opacity: 0.6 }}>Giá bán:</Typography>
                                        <Typography sx={{ fontSize: 'xl', fontWeight: '700', color: 'black' }}>
                                            {m.price.toLocaleString("vi-VN")} <span style={{ fontSize: 14 }}>đ</span>
                                        </Typography>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </Box>}
            {adding && fileredMerchandise.length == 0
                &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Alert
                        color="danger"
                        size="md"
                        variant="soft"
                        sx={{ width: '50%', margin: '20px' }}
                    >Không tìm thấy đồ lưu niệm</Alert>
                </div>
            }
            {allMerchandises.length == 0 && adding &&
                <Alert
                    color="danger"
                    size="md"
                    variant="soft"
                >Không tìm thấy đồ lưu niệm</Alert>
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
export default Merchandise;