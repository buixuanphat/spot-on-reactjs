import { Alert, Box, Button, CircularProgress, Snackbar, Stack, Switch, Typography } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import ErrorDialog from "./layout/ErrorDialog";
import { authApis, endpoints } from "../configs/Apis";
import { useParams } from "react-router-dom";
import { Avatar, DatePicker, Form, Input, Select, Upload, Button as AntButton } from "antd";
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import SaveIcon from '@mui/icons-material/Save';
import { UploadOutlined } from '@ant-design/icons';
import MySnackBar from "./layout/MySnackBar";

const OrganizerDetail = () => {
    const [organizer, setOrganizer] = useState(null);

    const [loading, setLoading] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    const params = useParams();

    const [successMessage, setSuccessMessage] = useState(null);
    const [openSuccessSnack, setOpenSuccessSnack] = useState(false);


    const fetchOrganizer = async () => {
        try {
            setLoading(true);
            let res = await authApis().get(endpoints['getOrganizer'](params.id));
            setOrganizer(res.data.data);
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
        fetchOrganizer();
    }, [params.id]);

    const verify = async (accept) => {
        try {
            setLoading(true);
            let res = authApis().patch(endpoints['verifyOrganizer'](params.id),null,
                {
                    params: {
                        'accept': accept
                    }
                });
                if ((await res).status == 200) {
                    setOpenSuccessSnack(true)
                    setTimeout(() => {
                        setOpenSuccessSnack(false);
                    }, 2000);
                }
        }
        catch (e) {
            setErrorMessage(e.response?.data?.message || e.message);
            setOpenDialog(true);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <Box>
            {loading && <CircularProgress style={{}} />}
            {!loading && organizer ?
                <Stack direction='column'>
                    <Typography level="h3" textAlign='center' >Thông tin Ban tổ chức</Typography>
                    <Form >
                        <Form.Item label="ID" rules={[{ required: true }]}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Input value={organizer.id} disabled='true' />
                        </Form.Item>


                        <Form.Item label="Tên Ban tổ chức"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Input value={organizer.name} disabled='true' />
                        </Form.Item>


                        <Form.Item label="Email"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Input value={organizer.email} disabled='true' />
                        </Form.Item>


                        <Form.Item label="Mã số thuế"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Input value={organizer.taxCode} disabled='true' />
                        </Form.Item>


                        <Form.Item label="Số điện thoại"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Input value={organizer.phoneNumber} disabled='true' />
                        </Form.Item>


                        <Form.Item label="Ngân hàng"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Input value={organizer.bank} disabled='true' />
                        </Form.Item>


                        <Form.Item label="Số tài khoản"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Input value={organizer.bankNumber} disabled='true' />
                        </Form.Item>


                        <Form.Item label="Địa chỉ"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Input value={organizer.address} disabled='true' />
                        </Form.Item>


                        <Form.Item label="Mô tả"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Input value={organizer.description} disabled='true' />
                        </Form.Item>

                        <Form.Item label="Ngày tạo"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Input value={organizer.createdDate} disabled='true' />
                        </Form.Item>


                        <Form.Item label="Hoạt động"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Input value={organizer.active ? 'Đang hoạt động' : 'Không hoạt động'} disabled='true' />
                        </Form.Item>


                        <Form.Item label="Trạng thái"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Input value={organizer.status} disabled='true' />
                        </Form.Item>


                        <Form.Item label="Logo"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <Avatar size={200} src={organizer.avatar} />
                        </Form.Item>


                        <Form.Item label="Giấy phép kinh doanh"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <iframe
                                src={`https://docs.google.com/gview?url=${encodeURIComponent(organizer.businessLicense)}&embedded=true`}
                                width="100%"
                                height="500px"
                            />

                        </Form.Item>

                        <Form.Item
                            label='Hành động'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>

                            {organizer.status === 'pending' ?
                                <Stack>
                                    <Button onClick={()=>verify(true)} loading={loading} color="success" >Chấp nhận</Button>
                                    <Button onClick={()=>verify(false)} loading={loading} color="danger" >Từ chối</Button>
                                </Stack> :
                                <Box>
                                    <Button color="neutral" startDecorator={<EditDocumentIcon />}>Chỉnh sửa</Button>
                                </Box>}
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
            <MySnackBar message={"Xác thực thành công"} open={openSuccessSnack} />
        </Box>
    );

}
export default OrganizerDetail;