import { Alert, Box, Button, CircularProgress, Snackbar, Stack, Switch, Typography } from "@mui/joy";
import React, { useEffect, useState } from "react";
import ErrorDialog from "../components/ErrorDialog";
import { authApis, endpoints } from "../configs/Apis";
import { useParams } from "react-router-dom";
import { Avatar, Form, Image, Input } from "antd";
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import MySnackBar from "../components/MySnackBar";
import CreateSection from "../screen/CreateSection";
import Voucher from "../components/Voucher";
import Merchandise from "../components/Merchandise";

const EventDetail = () => {
    const [event, setEvent] = useState(null);

    const [loading, setLoading] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    const params = useParams();

    const [successMessage, setSuccessMessage] = useState(null);
    const [openSuccessSnack, setOpenSuccessSnack] = useState(false);


    const fetchEvent = async () => {
        try {
            setLoading(true);
            let res = await authApis().get(endpoints['getEvent'](params.id));
            setEvent(res.data.data);
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
        fetchEvent();
    }, [params.id]);

    const verify = async (accept) => {
        try {
            setLoading(true);
            let res = authApis().patch(endpoints['verifyEvent'](params.id), null,
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
            {!loading && event ?
                <Stack direction='column'>
                    <Typography level="h3" textAlign='center' >Thông tin sự kiện</Typography>
                    <Form >
                        <Form.Item label="ID"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Input value={event.id} disabled='true' />
                        </Form.Item>


                        <Form.Item label="Tên sự kiện"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Input value={event.name} />
                        </Form.Item>


                        <Form.Item label="Thời gian bắt đầu"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Input value={event.startTime} />
                        </Form.Item>


                        <Form.Item label="Thời gian kết thúc"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Input value={event.endTime} />
                        </Form.Item>


                        <Form.Item label="Địa điểm tổ chức"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Input value={event.location} />
                        </Form.Item>


                        <Form.Item label="Mô tả"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Input value={event.description} />
                        </Form.Item>


                        <Form.Item label="Độ tuổi giới hạn"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Input value={event.ageLimit} />
                        </Form.Item>


                        <Form.Item label="Trạng thái"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Input value={event.status} />
                        </Form.Item>


                        <Form.Item label="Ngày tạo"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Input value={event.createdDate} />
                        </Form.Item>

                        <Form.Item label="Đơn vị tổ chức"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Input value={event.organizer.name} />
                        </Form.Item>


                        <Form.Item label="Hoạt động"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Input value={event.active ? 'Đang hoạt động' : 'Không hoạt động'} />
                        </Form.Item>



                        <Form.Item label="Hình ảnh"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Image width='50%' src={event.image} />
                        </Form.Item>


                        <Form.Item label="Giấy phép tổ chức sự kiện"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <iframe
                                src={`https://docs.google.com/gview?url=${encodeURIComponent(event.license)}&embedded=true`}
                                width="50%"
                                height="500px"
                            />

                        </Form.Item>

                        <Form.Item
                            label='Hành động'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>

                            {event.status === 'pending' ?
                                <Stack>
                                    <Button onClick={() => verify(true)} loading={loading} color="success" >Chấp nhận</Button>
                                    <Button onClick={() => verify(false)} loading={loading} color="danger" >Từ chối</Button>
                                </Stack> :
                                <Box>
                                    <Button color="neutral" startDecorator={<EditDocumentIcon />}>Chỉnh sửa</Button>
                                </Box>}
                        </Form.Item>
                    </Form>






                    {/* SECTIONS */}
                    <CreateSection eventId={event.id} />


                    {/* VOUCHERS */}
                    <Voucher eventId={event.id} />

                    {/* MERCHANDISE */}
                    <Merchandise eventId={event.id} />



                </Stack>
                :
                <Alert
                    color="danger"
                    size="md"
                    variant="soft"
                >Không tìm thấy thông tin sự kiện</Alert>
            }
            <ErrorDialog open={openDialog} message={errorMessage} onClose={() => setOpenDialog(false)} />
            <MySnackBar message={"Xác thực thành công"} open={openSuccessSnack} />
        </Box>
    );

}
export default EventDetail;