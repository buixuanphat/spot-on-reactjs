import { Stack, Typography } from "@mui/joy";
import React, { useRef, useState } from "react";
import ErrorDialog from "../components/ErrorDialog";
import { useNavigate } from "react-router-dom";
import { Avatar, Form, Input, Select, Button } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import MySnackBar from "../components/MySnackBar";
import SaveButton from "../components/SaveButton";
import { authApis, endpoints } from "../configs/Apis";


const CreateUser = () => {

    const nav = useNavigate()

    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [openSuccessSnack, setOpenSuccessSnack] = useState(false);

    const [form] = Form.useForm()


    const avatarRef = useRef();
    const [avatar, setAvatar] = useState(null);


    const createUser = async (user) => {
        try {
            setLoading(true)

            let formData = new FormData()
            formData.append('firstname', user.firstname);
            formData.append('lastname', user.lastname);
            formData.append('email', user.email);
            formData.append('password', user.password);
            formData.append('role', user.role);

            if (avatar)
                formData.append("avatar", avatarRef.current.files[0])

            let res = await authApis().post(endpoints['createUser'], formData)
            if (res.status == 200) {
                setSuccessMessage("Tạo người dùng thành công")
                setOpenSuccessSnack(true)
                setTimeout(() => {
                    setOpenSuccessSnack(false)
                    nav(-1)
                }, 2000)
            }
        }
        catch (e) {
            setErrorMessage(e.response?.data?.message || e.message)
            setOpenDialog(true);
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ margin: '50px' }}>
            <div>
                <Typography sx={{ marginBottom: '10px' }} level="h3" textAlign='center' >Tạo người dùng</Typography>
                <Form
                    form={form}
                    onFinish={createUser}
                >



                    <Form.Item label="Họ"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="lastname"
                        rules={[{ required: true, message: 'Họ không được để trống' }]}>
                        <Input />
                    </Form.Item>


                    <Form.Item label="Tên"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="firstname"
                        rules={[{ required: true, message: 'Tên không được để trống' }]}>
                        <Input />
                    </Form.Item>


                    <Form.Item label="Email"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="email"
                        rules={[{ required: true, message: 'Email không được để trống' }]}>
                        <Input />
                    </Form.Item>



                    <Form.Item label="Mật khẩu"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="password"
                        rules={[{ required: true, message: 'Mật khẩu không được để trống' }]}>
                        <Input type='password' />
                    </Form.Item>




                    <Form.Item label="Vai trò" rules={[{ required: true }]}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name='role'>
                        <Select
                            style={{ width: 120 }}
                            onChange={(value) => form.setFieldValue('tier', value)}
                            options={[
                                { value: 'staff', label: 'Nhân viên' },
                                { value: 'admin', label: 'Quản trị viên' },
                            ]}
                        />
                    </Form.Item>


                    <Form.Item label="Ảnh đại diện"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name='avatar'
                        rules={[{ required: true, message: 'Ảnh đại diện không được để trống' }]}
                    >
                        <Stack direction='column'>
                            <Avatar size={200} src={avatar ? URL.createObjectURL(avatar) : form.getFieldValue('avatar')} />
                            <input
                                type="file"
                                accept="image/*"
                                ref={avatarRef}
                                onChange={() => {
                                    setAvatar(avatarRef.current.files[0])
                                    form.setFieldValue("avatar", avatarRef.current.files[0])
                                }}
                                hidden
                            />

                            <Button
                                style={{
                                    width: '50%',
                                    marginTop: '10px'
                                }}
                                onClick={() => avatarRef.current.click()}
                                icon={<UploadOutlined />}>
                                Click to Upload
                            </Button>

                        </Stack>
                    </Form.Item>
                    <Form.Item
                        label='Hành động'
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <SaveButton loading={loading} />
                    </Form.Item>
                </Form>
            </div>
            <ErrorDialog open={openDialog} message={errorMessage} onClose={() => setOpenDialog(false)} />
            <MySnackBar message={successMessage} open={openSuccessSnack} />
        </div>
    );
}
export default CreateUser;