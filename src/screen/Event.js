import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination } from "@mui/material";
import { authApis, endpoints } from "../configs/Apis";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, CircularProgress, Stack, Table, ToggleButtonGroup } from "@mui/joy";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";
import { MyStatus } from "../configs/Enum";
import { MyUserContext } from "../Contexts";

const Event = () => {

    const user = useContext(MyUserContext);

    const [events, setEvents] = useState([])

    const [openDialog, setOpenDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [pageNo, setPageNo] = useState(0);
    const [page, setPage] = useState(0);

    const [name, setName] = useState('');
    const [id, setId] = useState();
    const [status, setStatus] = useState(MyStatus.pendding);

    const numberRegex = /^\d+$/;

    const nav = useNavigate();

    const fetchEvents = async () => {
        try {
            setLoading(true);
            let res = await authApis().get(endpoints['getEvents'], {
                params:
                {
                    organizerId: user.organizer.id,
                    id,
                    name,
                    page,
                    status
                }
            }
            );
            console.log(res.data.data.content)
            console.log(name)
            setEvents(res.data.data.content);
            setPageNo(res.data.data.totalPages)
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
        setPage(0)
        let timer = setTimeout(() => {
            fetchEvents();
        }, 1000)
        return () => clearTimeout(timer)
    }, [name, page, id, status]);


    return (
        <Box sx={{
            my: '5%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }} >
            <Input
                placeholder="Tìm kiếm"
                size="large"
                onChange={(e) => {
                    if (numberRegex.test(e.target.value)) {
                        setId(e.target.value);
                        setName('')
                    }
                    else {
                        setName(e.target.value);
                        setId(undefined)
                    }
                }}
            />

            <Stack direction='row' display='flex' justifyContent='space-between' mt={1} >
                <ToggleButtonGroup
                    variant="soft"
                    value={status}
                    exclusive
                    onChange={(event, newValue) => {
                        setStatus(newValue);
                        console.log(newValue);
                    }}
                >
                    <Button value={MyStatus.pendding}>Chờ xác thực</Button>
                    <Button value={MyStatus.verified}>Đã xác thực</Button>
                    <Button value={MyStatus.running}>Đang hoạt động</Button>
                    <Button value={MyStatus.rejected}>Đã từ chối</Button>
                </ToggleButtonGroup>

                <Button
                    startDecorator={<Add />}
                    variant="solid"
                    onClick={() => nav('/events/register')}>
                    Thêm
                </Button>
            </Stack>
            {loading && <CircularProgress style={{}} />}
            {!loading && events.length > 0 ?
                <Table
                    sx={{ mt: 1 }}
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
                            <th>Tên Sự kiện</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(events).map(e =>
                            <tr key={e.id} style={{ cursor: 'pointer' }} onClick={() => nav(`/events/${e.id}`)}>
                                <td>{e.id}</td>
                                <td>{e.name}</td>
                                <td>{e.status}</td>
                            </tr>
                        )}
                    </tbody>
                </Table> :
                <Alert
                    color="danger"
                    size="md"
                    variant="soft"
                >Không tìm thấy Sự kiện</Alert>

            }
            <Box sx={{ mt: 1, width: '100%', display: 'flex', justifyContent: 'center' }} >
                {events.length > 0 && <Pagination count={pageNo} onChange={(e, value) => setPage(value - 1)} />}
            </Box>
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
export default Event;
