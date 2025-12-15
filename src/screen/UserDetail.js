import { Alert, Box, Button, CircularProgress, Snackbar, Stack, Switch, Typography } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import ErrorDialog from "../components/ErrorDialog";
import { authApis, endpoints } from "../configs/Apis";
import { useParams } from "react-router-dom";
import { Avatar, DatePicker, Form, Input, Select, Upload, Button as AntButton } from "antd";
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import SaveIcon from '@mui/icons-material/Save';
import { UploadOutlined } from '@ant-design/icons';
import MySnackBar from "../components/MySnackBar";

const UserDetail = () => {
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);

    const [errorMessage, setErrorMessage] = useState(null);

    const [edit, setEdit] = useState(false);

    const [updating, setUpdating] = useState(false);

    const params = useParams();

    const [successMessage, setSuccessMessage] = useState(null);
    const [openSuccessSnack, setOpenSuccessSnack] = useState(false);


    const fetchUser = async () => {
        try {
            setLoading(true);
            let res = await authApis().get(endpoints['getUser'](params.id));
            setUser(res.data.data);
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
        fetchUser();
    }, [params.id]);

    const avatarRef = useRef();
    const [avatar, setAvatar] = useState(null);
    const [validateError, setValidateError] = useState('');
    const validate = () => {
        return true;
    }
    const update = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                setUpdating(true);
                let form = new FormData();
                form.append('lastname', user.lastname);
                form.append('firstname', user.firstname);
                form.append('email', user.email);
                form.append('dateOfBirth', user.dateOfBirth);
                form.append('coins', user.coins);
                form.append('tier', user.tier);
                form.append('role', user.role);
                form.append('active', user.active);

                if (avatar) {
                    form.append('avatar', avatarRef.current.files[0]);
                }

                let res = authApis().patch(endpoints['updateUser'](params.id), form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                if ((await res).status == 200) 
                {
                    setEdit(false);
                    setSuccessMessage("Cập nhật thông tin thành công");
                    setOpenSuccessSnack(true)
                    setTimeout(()=>
                    {
                        setOpenSuccessSnack(false);
                    }, 2000);
                }
            }
            catch (e) {
                setErrorMessage(e?.response?.data?.message || e.message);
                setOpenDialog(true);
            }
            finally {
                setUpdating(false);
            }
        }
    }

    return (
        <Box>
            {loading && <CircularProgress style={{}} />}
            {!loading && user ?
                <Stack direction='column'>
                    <Typography level="h3" textAlign='center' >Thông tin người dùng</Typography>
                    <Form >
                        <Form.Item label="ID" rules={[{ required: true }]}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Input width='50%' value={user.id} disabled='true' />
                        </Form.Item>


                        <Form.Item label="Họ"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Input value={user.lastname} disabled={!edit} onChange={(e) => setUser({ ...user, lastname: e.target.value })} />
                        </Form.Item>


                        <Form.Item label="Tên"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Input value={user.firstname} disabled={!edit} onChange={(e) => setUser({ ...user, firstname: e.target.value })} />
                        </Form.Item>


                        <Form.Item label="Email" rules={[{ required: true }]}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Input value={user.email} disabled={!edit} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                        </Form.Item>


                        <Form.Item label="Ngày sinh"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            {edit && <DatePicker onChange={(e, v) => { setUser({ ...user, dateOfBirth: v }) }} />}
                            {!edit && <Input value={user.dateOfBirth} disabled='true' onChange={(e, v) => setUser({ ...user, dateOfBirth: v })} />}

                        </Form.Item>


                        <Form.Item label="Xu"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Input type='number' value={user.coins} disabled={!edit} onChange={(e) => setUser({ ...user, coins: e.target.value })} />
                        </Form.Item>


                        <Form.Item label="Hạng thành viên"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Select
                                disabled={!edit}
                                value={user.tier}
                                style={{ width: 120 }}
                                onChange={(value) => setUser({ ...user, tier: value })}
                                options={[
                                    { value: 'copper', label: 'Đồng' },
                                    { value: 'silver', label: 'Bạc' },
                                    { value: 'gold', label: 'Vàng' },
                                ]}
                            />
                        </Form.Item>


                        <Form.Item label="Vai trò" rules={[{ required: true }]}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Select
                                disabled={!edit}
                                value={user.role}
                                style={{ width: 120 }}
                                onChange={(value) => setUser({ ...user, role: value })}
                                options={[
                                    { value: 'customer', label: 'Khách hàng' },
                                    { value: 'organizer', label: 'Ban tổ chức' },
                                    { value: 'staff', label: 'Nhân viên' },
                                    { value: 'admin', label: 'Quản trị viên' },
                                ]}
                            />
                        </Form.Item>


                        <Form.Item label="Ngày đăng kí" rules={[{ required: true }]}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Input value={user.createdDate} disabled='true' />
                        </Form.Item>
                        <Form.Item label="Hoạt động" rules={[{ required: true }]}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            {edit ?
                                <Switch
                                    checked={user.active}
                                    onChange={() => setUser({ ...user, active: !user.active })}
                                    slotProps={{
                                        track: {
                                            children: (
                                                <React.Fragment>
                                                    <Typography component="span" level="inherit" sx={{ ml: '10px' }}>
                                                        On
                                                    </Typography>
                                                    <Typography component="span" level="inherit" sx={{ mr: '8px' }}>
                                                        Off
                                                    </Typography>
                                                </React.Fragment>
                                            ),
                                        },
                                    }}
                                    sx={{
                                        '--Switch-thumbSize': '27px',
                                        '--Switch-trackWidth': '64px',
                                        '--Switch-trackHeight': '31px',
                                    }}
                                /> : <Input value={user.active ? 'Đang hoạt động' : 'Không hoạt động'} disabled={!edit} />}
                        </Form.Item>
                        <Form.Item label="Ảnh đại diện"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Stack direction='column'>
                                <Avatar size={200} src={avatar ? URL.createObjectURL(avatar) : user.avatar} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={avatarRef}
                                    onChange={() => setAvatar(avatarRef.current.files[0])}
                                    hidden
                                />
                                {edit &&
                                    <AntButton disabled={updating} onClick={() => avatarRef.current.click()} icon={<UploadOutlined />}>Click to Upload</AntButton>
                                }
                            </Stack>
                        </Form.Item>
                        <Form.Item
                            label='Hành động'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            {edit ? <Button loading={updating} onClick={(e) => update(e)} color="success" startDecorator={<SaveIcon />}>Lưu</Button> : <Button onClick={() => setEdit(true)} color="neutral" startDecorator={<EditDocumentIcon />}>Chỉnh sửa</Button>}
                        </Form.Item>
                    </Form>


                </Stack> :
                <Alert
                    color="danger"
                    size="md"
                    variant="soft"
                >Không tìm thấy thông tin người dùng</Alert>
            }
            <ErrorDialog open={openDialog} message={errorMessage} onClose={() => setOpenDialog(false)} />
            <MySnackBar message={successMessage} open={openSuccessSnack} />
        </Box>
    );
}
export default UserDetail;