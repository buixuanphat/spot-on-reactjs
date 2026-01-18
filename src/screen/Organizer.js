import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination } from "@mui/material";
import { authApis, endpoints } from "../configs/Apis";
import { useEffect, useState } from "react";
import { Alert, CircularProgress, Option, Select, selectClasses, Stack, Table, ToggleButtonGroup, Button } from "@mui/joy";
import { Add, KeyboardArrowDown } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";
import { MyStatus } from "../configs/Enum";

const Organizer = () => {

    const [organizers, setOrganizer] = useState([])
    const [name, setName] = useState()
    const [id, setId] = useState()
    const [status, setStatus] = useState(MyStatus.pending)

    const [openDialog, setOpenDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageNo, setPageNo] = useState(0);
    const [page, setPage] = useState(0);

    const numberRegex = /^\d+$/;

    const nav = useNavigate();

    const fetchOrganizers = async () => {
        try {
            setLoading(true);
            let res = await authApis().get(endpoints['getOrganizers'], {
                params: {
                    'status': status,
                    'page': page,
                    'name': name,
                    'id': id

                }
            });
            setOrganizer(res.data.data.content);
            setPageNo(res.data.data.totalPages)
        }
        catch (e) {
            if (e.response?.data?.message) {
                setErrorMessage(e.response?.data?.message)
                setOpenDialog(true);
            }
            console.log(e)
        }
        finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchOrganizers();
    }, [page, status]);


    useEffect(() => {
        setPage(0)
        let timer = setTimeout(() => {
            fetchOrganizers();
        }, 1000)
        return () => clearTimeout(timer)
    }, [name, id]);




    return (
        <div style={{ margin: '50px' }}>

            <Input
                style={{ marginBottom: '10px' }}
                size="large"
                placeholder="Tìm kiếm"
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
            <Stack direction='row' display='flex' justifyContent='space-between' marginBottom='10px'>
                <ToggleButtonGroup
                    variant="soft"
                    value={status}
                    exclusive
                    onChange={(event, newValue) => {
                        setStatus(newValue);
                    }}
                >
                    <Button value={MyStatus.pending}>Chờ xác thực</Button>
                    <Button value={MyStatus.verified}>Đã xác thực</Button>
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
            {!loading && organizers.length > 0 ?
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
                            <th>Tên công ty</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(organizers).map(o =>
                            <tr key={o.id} style={{ cursor: 'pointer' }} onClick={() => nav(`/organizers/${o.id}`)}>
                                <td>{o.id}</td>
                                <td>{o.name}</td>
                                <td>{o.email}</td>
                            </tr>
                        )}
                    </tbody>
                </Table> :
                <Alert
                    color="danger"
                    size="md"
                    variant="soft"
                >Không tìm thấy Công ty</Alert>

            }
            {organizers.length > 0 &&
                <div style={{ margin: '10px', display: 'flex', justifyContent: 'center' }} >
                    <Pagination count={pageNo} onChange={(e, value) => setPage(value - 1)} />
                </div>}
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
        </div>
    );
}
export default Organizer;
