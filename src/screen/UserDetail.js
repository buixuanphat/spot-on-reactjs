import { Alert, CircularProgress, Stack, Switch, Typography } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import ErrorDialog from "../components/ErrorDialog";
import { authApis, endpoints } from "../configs/Apis";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, DatePicker, Form, Input, Select, Button } from "antd";
import dayjs from "dayjs";
import { UploadOutlined } from '@ant-design/icons';
import MySnackBar from "../components/MySnackBar";
import EdittButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import SaveButton from "../components/SaveButton";
import CloseButton from "../components/CloseButton";

const UserDetail = () => {

    const nav = useNavigate()

    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const [edit, setEdit] = useState(false);

    const [updating, setUpdating] = useState(false);

    const params = useParams();

    const [successMessage, setSuccessMessage] = useState(null);
    const [openSuccessSnack, setOpenSuccessSnack] = useState(false);

    const [form] = Form.useForm()


    const fetchUser = async () => {
        try {
            setLoading(true);
            let res = await authApis().get(endpoints['getUser'](params.id));
            const user = res.data.data

            form.setFieldValue('id', user.id)
            form.setFieldValue('firstname', user.firstname || '')
            form.setFieldValue('lastname', user.lastname || '')
            form.setFieldValue('email', user.email)
            form.setFieldValue('coins', user.coins || '')
            form.setFieldValue('tier', user.tier || '')
            form.setFieldValue('role', user.role)
            form.setFieldValue('createdDate', user.createdDate)
            form.setFieldValue('avatar', user.avatar || '')
        }
        catch (e) {
            console.log(e)
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


    const update = async (user) => {

        try {
            setUpdating(true);
            let form = new FormData();
            form.append('lastname', user.lastname || '');
            form.append('firstname', user.firstname || '');
            form.append('email', user.email);
            form.append('coins', user.coins || '');
            if (user.tier) {
                form.append('tier', user.tier);
            }

            form.append('role', user.role);


            if (avatar) {
                form.append('avatar', avatarRef.current.files[0]);
            }

            let res = await authApis().patch(endpoints['updateUser'](params.id), form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (res.status == 200) {
                setEdit(false);
                setSuccessMessage("Cập nhật thông tin thành công");
                setOpenSuccessSnack(true)
                setTimeout(() => {
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

    const disable = async () => {
        try {
            setLoading(true)
            let res = await authApis().patch(endpoints['disableUser'](params.id))
            if (res.status === 200) {
                setSuccessMessage("Đã xóa người dùng")
                setOpenSuccessSnack(true)
                setTimeout(() => {
                    setOpenSuccessSnack(false)
                    nav('/users')
                }, 2000)
            }
        }
        catch (e) {
            if (e?.response?.data?.message) {
                setErrorMessage(e?.response?.data?.message)
                setOpenDialog(true);
            }
            console.error(e)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ margin: '50px' }}>
            {loading && <CircularProgress style={{}} />}
            <div>
                <Typography sx={{ marginBottom: '10px' }} level="h3" textAlign='center' >Thông tin người dùng</Typography>
                <Form
                    form={form}
                    onFinish={(value) => update(value)}
                >
                    <Form.Item label="ID"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="id">
                        <Input disabled={true} />
                    </Form.Item>


                    <Form.Item label="Họ"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="lastname">
                        <Input disabled={!edit} />
                    </Form.Item>


                    <Form.Item label="Tên"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="firstname">
                        <Input disabled={!edit} />
                    </Form.Item>


                    <Form.Item label="Email"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="email"
                        rules={[{ required: true, message: 'Email không được để trống' }]}>
                        <Input disabled={!edit} />
                    </Form.Item>


                    <Form.Item label="Xu"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 20 }}
                        name="coins">
                        <Input type='number' disabled={!edit} />
                    </Form.Item>


                    <Form.Item label="Hạng thành viên"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name='tier'
                    >
                        <Select
                            disabled={!edit}
                            style={{ width: 120 }}
                            onChange={(value) => {
                                form.setFieldValue("tier", value)
                            }
                            }
                            options={[
                                { value: 'copper', label: 'Đồng' },
                                { value: 'silver', label: 'Bạc' },
                                { value: 'gold', label: 'Vàng' },
                            ]}
                        />
                    </Form.Item>


                    <Form.Item label="Vai trò"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name='role'
                        rules={[{ required: true, message: 'Vai tròn không được để trống' }]}>
                        <Select
                            disabled={!edit}
                            style={{ width: 120 }}
                            onChange={(value) => form.setFieldValue('role', value)}
                            options={[
                                { value: 'customer', label: 'Khách hàng' },
                                { value: 'staff', label: 'Nhân viên' },
                                { value: 'admin', label: 'Quản trị viên' },
                            ]}
                        />
                    </Form.Item>


                    <Form.Item label="Ngày đăng kí" rules={[{ required: true }]}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name='createdDate'>
                        <Input disabled={true} />
                    </Form.Item>

                    <Form.Item label="Ảnh đại diện"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name='avatar'
                    >
                        <Stack direction='column'>
                            <Avatar size={200} src={avatar ? URL.createObjectURL(avatar) : form.getFieldValue('avatar')} />
                            <input
                                type="file"
                                accept="image/*"
                                ref={avatarRef}
                                onChange={() => setAvatar(avatarRef.current.files[0])}
                                hidden
                            />
                            {edit &&
                                <Button
                                    style={{
                                        width: '50%',
                                        marginTop: '10px'
                                    }}
                                    disabled={updating}
                                    onClick={() => avatarRef.current.click()}
                                    icon={<UploadOutlined />}>
                                    Click to Upload
                                </Button>
                            }
                        </Stack>
                    </Form.Item>
                    <Form.Item
                        label='Hành động'
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        {edit &&
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <SaveButton loading={updating} />
                                <CloseButton onClick={() => setEdit(false)} />
                            </div>}

                        {!edit && (
                            <view style={{ display: 'flex', gap: '10px' }}>
                                <EdittButton
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setEdit(true);
                                    }}
                                />
                                <DeleteButton
                                    loading={updating}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        disable()
                                    }}
                                />
                            </view>

                        )}
                    </Form.Item>
                </Form>
            </div>
            <ErrorDialog open={openDialog} message={errorMessage} onClose={() => setOpenDialog(false)} />
            <MySnackBar message={successMessage} open={openSuccessSnack} />
        </div>
    );
}
export default UserDetail;