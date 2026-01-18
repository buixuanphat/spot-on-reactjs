import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination } from "@mui/material";
import { authApis, endpoints } from "../configs/Apis";
import { useEffect, useState } from "react";
import { Alert, Button, CircularProgress, Table } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";
import { Add } from "@mui/icons-material";

const User = () => {

    const [users, setUsers] = useState([])
    const [email, setEmail] = useState()
    const [id, setId] = useState()

    const [openDialog, setOpenDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageNo, setPageNo] = useState(0);
    const [page, setPage] = useState(0);

    const numberRegex = /^\d+$/;

    const nav = useNavigate();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            let res = await authApis().get(endpoints['getUsers'], {
                params: {
                    'page': page,
                    'email': email,
                    'id': id
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
    }, [page]);

    useEffect(() => {
        setPage(0)
        let timer = setTimeout(() => {
            fetchUsers();
        }, 1000)
        return () => clearTimeout(timer)
    }, [email, id]);


    return (
        <div style={{ margin: '50px' }}>
            <Input
                style={{ marginBottom: '10px' }}
                placeholder="Tìm kiếm"
                size="large"
                onChange={(e) => {
                    if (numberRegex.test(e.target.value)) {
                        setId(e.target.value);
                        setEmail('')
                    }
                    else {
                        setEmail(e.target.value);
                        setId(undefined)
                    }
                }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }} >
                <Button
                    style={{ marginBottom: '10px' }}
                    startDecorator={<Add />}
                    variant="solid"
                    onClick={() => nav('/users/create')}>
                    Thêm
                </Button>
            </div>




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
                            <tr key={u.id} style={{ cursor: 'pointer' }} onClick={() => nav(`/users/${u.id}`)}>
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
            {users.length > 0 &&
                <div style={{ margin: '10px', display: 'flex', justifyContent: 'center' }}>
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
export default User;
