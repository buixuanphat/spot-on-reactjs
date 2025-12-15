import { Alert, AspectRatio, Box, Button, Card, CardContent, CircularProgress, DialogTitle, IconButton, Typography } from "@mui/joy";
import { Dialog, DialogActions, DialogContent, DialogContentText, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { authApis, endpoints } from "../configs/Apis";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { MyUserContext } from "../Contexts";
import { useContext } from "react";
import AddBoxIcon from '@mui/icons-material/AddBox';

const Merchandise = ({ eventId }) => {

    const [merchandises, setMerchandises] = useState([])
    const [loading, setLoading] = useState(false);
    const [loadingAll, setLoadingAll] = useState(false);
    const [page, setPage] = useState(0);
    const [pageAll, setPageAll] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalPagesAll, setTotalPagesAll] = useState(0);
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
                    'page': page,
                    'organizerId': user.organizer.id
                }
            });
            setAllMerchandises(res.data.data.content);
            setTotalPagesAll(res.data.data.totalPages)
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

    useEffect(()=>
    {
        fetchEventMerchandise();
    },[]);

    const createEventMerchandise = async(merchandiseId) =>
    {
        try
        {
            let res = await authApis().post(endpoints.createEventMerchandise, 
                {
                    "eventId" : eventId,
                    "merchandiseId" : merchandiseId
                }
            );

            if(res.status===200) fetchEventMerchandise();

        }
        catch(e)
        {
            setErrorMessage(e.response?.data?.message || e.message)
            setOpenDialog(true);
        }
    }

    const deleteEventMerchandise = async(id) =>
    {
        try
        {
            let res = await authApis().delete(endpoints['deleteEventMerchandise'](id));
            if(res.status===200) fetchEventMerchandise();
        }
        catch(e)
        {
            setErrorMessage(e.response?.data?.message || e.message)
            setOpenDialog(true);
        }
    }


    return (
        <Box>

             { merchandises.length > 0  && merchandises.map(m => <Card color="success" variant="soft" key={m.id} sx={{ width: 320 }}>
                        <div>
                            <Typography level="title-lg">{m.merchandise.name}</Typography>
                            <IconButton
                                aria-label="bookmark Bahamas Islands"
                                variant="plain"
                                color="danger"
                                size="sm"
                                sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}
                                onClick={()=>deleteEventMerchandise(m.id)}
                            >
                                <DeleteForeverIcon />
                            </IconButton>
                        </div>
                        <AspectRatio minHeight="120px" maxHeight="200px">
                            <img
                                src={m.merchandise.image}
                                loading="lazy"
                                alt=""
                            />
                        </AspectRatio>
                        <CardContent orientation="horizontal">
                            <div>
                                <Typography sx={{ fontSize: 'lg', fontWeight: 'lg' }}>{m.merchandise.price}</Typography>
                            </div>
                        </CardContent>
                    </Card>)}

            <Button onClick={() => {
                fetchAllMerchandises();
                setAdding(true);
            }
            } >Thêm</Button>
            {adding &&
                <Box>
                    { allMerchandises.length > 0  && allMerchandises.map(m => <Card color="primary" variant="soft" key={m.id} sx={{ width: 320 }}>
                        <div>
                            <Typography level="title-lg">{m.name}</Typography>
                            <IconButton
                                aria-label="bookmark Bahamas Islands"
                                variant="plain"
                                color="primary"
                                size="sm"
                                sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}
                                onClick={()=>createEventMerchandise(m.id)}
                            >
                                <AddBoxIcon />
                            </IconButton>
                        </div>
                        <AspectRatio minHeight="120px" maxHeight="200px">
                            <img
                                src={m.image}
                                loading="lazy"
                                alt=""
                            />
                        </AspectRatio>
                        <CardContent orientation="horizontal">
                            <div>
                                <Typography sx={{ fontSize: 'lg', fontWeight: 'lg' }}>{m.price}</Typography>
                            </div>
                        </CardContent>
                    </Card>)}
                </Box>}
            {allMerchandises.length == 0 && adding &&
                <Alert
                    color="danger"
                    size="md"
                    variant="soft"
                >Không tìm thấy đồ lưu niệm</Alert>
            }


            {allMerchandises.length > 0 && <Pagination count={totalPagesAll} onChange={(e, value) => setPageAll(value - 1)} />}
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