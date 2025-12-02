import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination } from "@mui/material";
import { authApis, endpoints } from "../configs/Apis";
import { useEffect, useRef, useState } from "react";
import { Alert, CircularProgress, Option, Select, selectClasses, Stack, Table, Input } from "@mui/joy";
import { KeyboardArrowDown } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Event = () => {

    const [events, setEvents] = useState([])

    const [openDialog, setOpenDialog] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    const [loading, setLoading] = useState(false);

    const [pageNo, setPageNo] = useState(0);

    const [page, setPage] = useState(0);

    const [kw, setKw] = useState('');
    const [filter, setFilter] = useState('id');
    const [status, setStatus] = useState('pending');
    const [active, setActive] = useState('true')

    const timeoutRef = useRef(null);

    const nav = useNavigate();

    const fetchEvents = async () => {
        try {
            setLoading(true);
            let res = await authApis().get(endpoints['getEvents'], {
                params: {
                    'status': status,
                    'page': page,
                    [filter]: kw,
                    'active' : active
                }
            });
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
        fetchEvents();
    }, [page, filter, kw, status, active]);





    return (
        <Box>
            <Button onClick={() => nav('/event/register')}>
                Tạo sự kiện mới
            </Button>
            <Stack direction={'row'}>
                <Input
                    placeholder="Tìm kiếm"
                    variant="soft"
                    onChange={(e) => {
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current)
                        }
                        timeoutRef.current = setTimeout(() => {
                            setKw(e.target.value);
                            setPage(0);
                        }, 1000);
                    }}
                />
                <Select
                    placeholder="Lọc"
                    variant="soft"
                    indicator={<KeyboardArrowDown />}
                    defaultValue={'id'}
                    sx={{
                        width: 240,
                        [`& .${selectClasses.indicator}`]: {
                            transition: '0.2s',
                            [`&.${selectClasses.expanded}`]: {
                                transform: 'rotate(-180deg)',
                            },
                        },
                    }}
                    onChange={(e, v) => setFilter(v)}
                >
                    <Option value='id'>ID</Option>
                    <Option value='name'>Tên</Option>
                </Select>

                <Select
                    placeholder="Trạng thái"
                    variant="soft"
                    indicator={<KeyboardArrowDown />}
                    defaultValue={'pending'}
                    sx={{
                        width: 240,
                        [`& .${selectClasses.indicator}`]: {
                            transition: '0.2s',
                            [`&.${selectClasses.expanded}`]: {
                                transform: 'rotate(-180deg)',
                            },
                        },
                    }}
                    onChange={(e, v) => setStatus(v)}
                >
                    <Option value='pending'>Chờ xử lý</Option>
                    <Option value='verified'>Đã xác thực</Option>
                    <Option value='rejected'>Đã từ chối</Option>
                </Select>


                <Select
                    placeholder="Hoạt động"
                    variant="soft"
                    indicator={<KeyboardArrowDown />}
                    defaultValue={'true'}
                    sx={{
                        width: 240,
                        [`& .${selectClasses.indicator}`]: {
                            transition: '0.2s',
                            [`&.${selectClasses.expanded}`]: {
                                transform: 'rotate(-180deg)',
                            },
                        },
                    }}
                    onChange={(e, v) => setActive(v)}
                >
                    <Option value='true'>Đã hoạt động</Option>
                    <Option value='false'>Không hoạt động</Option>
                </Select>
            </Stack>

            {loading && <CircularProgress style={{}} />}
            {!loading && events.length > 0 ?
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
                            <th>Tên Sự kiện</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(events).map(e =>
                            <tr key={e.id} style={{ cursor: 'pointer' }} onClick={()=>nav(`/events/${e.id}`)}>
                                <td>{e.id}</td>
                                <td>{e.name}</td>
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
            {events.length > 0 && <Pagination count={pageNo} onChange={(e, value) => setPage(value - 1)} />}
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
