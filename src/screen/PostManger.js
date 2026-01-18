import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination } from "@mui/material";
import { authApis, endpoints } from "../configs/Apis";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, CircularProgress, Stack, Table, ToggleButtonGroup } from "@mui/joy";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";
import { MyStatus } from "../configs/Enum";
import { MyUserContext } from "../Contexts";

const PostManager = () => {

    const [posts, setPosts] = useState([])

    const [openDialog, setOpenDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageNo, setPageNo] = useState(0);
    const [page, setPage] = useState(0);
    const [q, setQ] = useState('')


    const nav = useNavigate();

    const getPosts = async () => {
        try {
            setLoading(true)
            let url = `${endpoints['getPosts']}?kw=${q}&&page=${page}`
            let res = await authApis().get(url)
            setPageNo(res.data.data.pageable.totalPages)
            setPosts(res.data.data.content)
        }
        catch (e) {
            console.error(e)
        }
        finally {
            setLoading(false)
        }
    }



    useEffect(() => {
        let timer = setTimeout(() => {
            setPage(0)
            getPosts()
        }, 500)
        return () => clearTimeout(timer)
    }, [q, page])



    return (
        <div style={{ margin: '50px' }}>
            <Input
                placeholder="Tìm kiếm"
                size="large"
                onChange={(e) => {
                    setQ(e.target.value)
                }}
            />



            {loading && <CircularProgress style={{}} />}
            {!loading && posts.length > 0 ?
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
                            <th>Người dùng</th>
                            <th>Nội dung</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(posts).map(p =>
                            <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => nav(`/posts/${p.id}`)}>
                                <td>{p.id}</td>
                                <td>{p.user.firstname}</td>
                                <td>{p.caption}</td>
                            </tr>
                        )}
                    </tbody>
                </Table> :
                <Alert
                    color="danger"
                    size="md"
                    variant="soft"
                >Không tìm thấy bài viết</Alert>

            }
            <Box sx={{ mt: 1, width: '100%', display: 'flex', justifyContent: 'center' }} >
                {posts.length > 0 && <Pagination count={pageNo} onChange={(e, value) => setPage(value - 1)} />}
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
        </div>
    );
}
export default PostManager
