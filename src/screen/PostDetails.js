import { Alert, Box, CircularProgress, Divider, Snackbar, Stack, Switch, Typography as MuiTypo } from "@mui/joy";
import React, { useContext, useEffect, useState } from "react";
import ErrorDialog from "../components/ErrorDialog";
import { authApis, endpoints } from "../configs/Apis";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Button, Collapse, Form, Image, Input } from "antd";
import MySnackBar from "../components/MySnackBar";
import { MyUserContext } from "../Contexts";
import { Col, Row, Typography } from "antd/es";
import DeleteButton from "../components/DeleteButton";
const { Text, Title } = Typography;

const PostDetails = () => {
    const nav = useNavigate()

    const user = useContext(MyUserContext)

    const [post, setPost] = useState(null);

    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const [openSuccessSnack, setOpenSuccessSnack] = useState(false);

    const params = useParams();


    const getPost = async () => {
        try {
            setLoading(true)
            let res = await authApis().get(endpoints['getPost'](params.id))
            setPost(res.data.data)
        }
        catch (e) {
            console.error(e)
        }
        finally {
            setLoading(false)
        }
    }


    const deletePost = async () => {
        try {
            setLoading(true)
            let res = await authApis().delete(endpoints['deletePost'](params.id))
            if (res.status == 200) {
                setSuccessMessage("Đã xóa thành công")
                setOpenSuccessSnack(true)
                setTimeout(() => {
                    setOpenSuccessSnack(false)
                    nav(-1)
                }, 2000)
            }
        }
        catch (e) {
            console.error(e)
        }
        finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        getPost()
    }, [])


    return (
        <div style={{ margin: '50px' }}>
            {loading && <CircularProgress style={{}} />}
            {!loading && post ?
                <Stack direction='column'>

                    <MuiTypo level="h3" textAlign='center' my={2}>Thông tin bài viết</MuiTypo>
                    <Form >
                        <Form.Item label="ID"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input value={post.id} disabled />
                        </Form.Item>


                        <Form.Item label="Người dùng"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px',
                                borderRadius: '8px',
                            }}>
                                <Avatar
                                    src={post.user.avatar}
                                    size={54}
                                    style={{ verticalAlign: 'middle' }}
                                >
                                    {!post.user.avatar && post.user.firstname.charAt(0).toUpperCase()}
                                </Avatar>

                                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                                    <Text strong style={{ fontSize: '16px', marginBottom: '2px' }}>
                                        {post.user.firstname}
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        ID: {post.user.id}
                                    </Text>
                                </div>
                            </div>

                        </Form.Item>





                        <Form.Item label="Nội dung"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input value={post.caption} disabled />
                        </Form.Item>




                        <Form.Item label="Hình ảnh"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <div style={{ marginTop: '15px' }}>
                                {post.images && post.images.length > 0 && (
                                    <Image.PreviewGroup>
                                        <Row gutter={[8, 8]}>
                                            {post.images.map((img, index) => (
                                                <Col
                                                    xs={24}
                                                    sm={12}
                                                    key={index}
                                                >
                                                    <Image
                                                        src={img}
                                                        width="100%"
                                                        height={200}
                                                        style={{
                                                            objectFit: 'cover',
                                                            borderRadius: '8px'
                                                        }}
                                                    />
                                                </Col>
                                            ))}
                                        </Row>
                                    </Image.PreviewGroup>
                                )}
                            </div>
                        </Form.Item>

                        <Form.Item label="Hành động: "
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <DeleteButton onClick={deletePost} />
                        </Form.Item>

                    </Form>
                </Stack>
                :
                <Alert
                    color="danger"
                    size="md"
                    variant="soft"
                >Không tìm thấy thông tin sự kiện</Alert>
            }
            <ErrorDialog open={openDialog} message={errorMessage} onClose={() => setOpenDialog(false)} />
            <MySnackBar message={successMessage} open={openSuccessSnack} />
        </div>
    );
}
export default PostDetails