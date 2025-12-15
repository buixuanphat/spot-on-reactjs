import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination } from "@mui/material";
import { authApis, endpoints } from "../configs/Apis";
import { useEffect, useRef, useState } from "react";
import { Alert, CircularProgress, Option, Select, selectClasses, Stack, Table, Input } from "@mui/joy";
import { KeyboardArrowDown } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const User = () => {

    const [users, setUsers] = useState([])

    const [openDialog, setOpenDialog] = useState(false);

    const [errorMessage, setErrorMessage] = useState(null);

    const [loading, setLoading] = useState(false);

    const [pageNo, setPageNo] = useState(0);

    const [page, setPage] = useState(0);

    const [kw, setKw] = useState('');
    const [filter, setFilter] = useState('id');

    const timeoutRef = useRef(null);

    const nav = useNavigate();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            let res = await authApis().get(endpoints['getUsers'], {
                params: {
                    'page': page,
                    [filter]: kw
                }
            });
            setUsers(res.data.data.content);
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
        fetchUsers();
    }, [page, filter, kw]);





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
                    <Option value='email'>Email</Option>
                </Select>
            </Stack>

            {loading && <CircularProgress style={{}} />}
            {!loading && users.length > 0 ?
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
                            <th>Email</th>
                            <th>Vai trò</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(users).map(u =>
                            <tr key={u.id} style={{cursor:'pointer'}} onClick={()=>nav(`/users/${u.id}`)}>
                                <td>{u.id}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>
                            </tr>
                        )}
                    </tbody>
                </Table> :
                <Alert
                    color="danger"
                    size="md"
                    variant="soft"
                >Không tìm thấy người dùng</Alert>

            }
            {users.length > 0 && <Pagination count={pageNo} onChange={(e, value) => setPage(value - 1)} />}
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
export default User;
