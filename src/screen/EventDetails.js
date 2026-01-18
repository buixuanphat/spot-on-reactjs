import { Alert, Box, CircularProgress, Divider, Snackbar, Stack, Switch, Typography } from "@mui/joy";
import React, { useContext, useEffect, useState } from "react";
import ErrorDialog from "../components/ErrorDialog";
import { authApis, endpoints } from "../configs/Apis";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Button, Collapse, Form, Image, Input } from "antd";
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import MySnackBar from "../components/MySnackBar";
import CreateSection from "../components/CreateSection";
import Voucher from "../components/Voucher";
import Merchandise from "../components/Merchandise";
import { MyStatus, role } from "../configs/Enum";
import { MyUserContext } from "../Contexts";
import AcceptButton from "../components/AcceptButton";
import RejectButton from "../components/RejectButton";

const EventDetail = () => {
    const nav = useNavigate()

    const user = useContext(MyUserContext)

    const [event, setEvent] = useState(null);

    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const [openSuccessSnack, setOpenSuccessSnack] = useState(false);

    const params = useParams();



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
            setLoading(true)
            let res = await authApis().patch(endpoints['verifyEvent'](event.id), null,
                {
                    params:
                    {
                        accept: accept
                    }
                })

            if (res.status === 200) {
                setSuccessMessage("Xác thực thành công")
                setOpenSuccessSnack(true)
                setTimeout(() => {
                    setOpenSuccessSnack(false)
                    fetchEvent()
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

    const run = async () => {
        try {
            setLoading(true)
            let res = await authApis().patch(endpoints['runEvent'](params.id))
            if (res.status === 200) {
                setSuccessMessage("Đã mở bán vé sự kiện")
                setOpenSuccessSnack(true)
                setTimeout(() => {
                    setOpenSuccessSnack(false)
                    fetchEvent()
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
            {loading && <CircularProgress style={{}} />}
            {!loading && event ?
                <Stack direction='column'>

                    <Typography level="h3" textAlign='center' my={2}>Thông tin sự kiện</Typography>
                    <Form >
                        <Form.Item label="ID"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input value={event.id} disabled />
                        </Form.Item>


                        <Form.Item label="Tên sự kiện"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input value={event.name} disabled />
                        </Form.Item>


                        <Form.Item label="Thể loại"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input value={event.genre.name} disabled />
                        </Form.Item>


                        <Form.Item label="Ngày tổ chức"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input value={event.date} disabled />
                        </Form.Item>


                        <Form.Item label="Thời gian bắt đầu"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input value={event.startTime} disabled />
                        </Form.Item>


                        <Form.Item label="Thời gian kết thúc"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input value={event.endTime} disabled />
                        </Form.Item>


                        <Form.Item label="Địa điểm tổ chức"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input value={`${event.address}, ${event.province}, ${event.district}, ${event.ward}`} disabled />
                        </Form.Item>


                        <Form.Item label="Mô tả"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <div
                                dangerouslySetInnerHTML={{ __html: event.description }}
                            />

                        </Form.Item>


                        <Form.Item label="Độ tuổi giới hạn"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input value={event.ageLimit} disabled />
                        </Form.Item>


                        <Form.Item label="Trạng thái"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input value={event.status} disabled />
                        </Form.Item>


                        <Form.Item label="Ngày tạo"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input value={event.createdDate} disabled />
                        </Form.Item>

                        <Form.Item label="Đơn vị tổ chức"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input value={event.organizer.name} disabled />
                        </Form.Item>


                        <Form.Item label="Hình ảnh"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Image width='50%' src={event.image} />
                        </Form.Item>


                        <Form.Item label="Giấy phép tổ chức sự kiện"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <iframe
                                src={event.license}
                                width="50%"
                                height="500px"
                            />
                        </Form.Item>
                    </Form>

                    {user.role === role.organizer && event.status === MyStatus.verified &&
                        <div style={{ display: 'flex', justifyContent: 'center' }} >
                            <Button onClick={run} loading={loading} variant="solid" color="primary" style={{ marginBottom: '10px' }} >Mở bán vé</Button>
                        </div>
                    }

                    {user.role === role.organizer && event.status === MyStatus.running &&
                        <div style={{ display: 'flex', justifyContent: 'center' }} >
                            <Button onClick={() => nav(`/events-ticket/${event.id}`)} variant="solid" color="primary" style={{ marginBottom: '10px' }} >Xem thông tin vé</Button>
                        </div>
                    }

                    {(user.role === role.admin || user.role === role.staff) && event.status === MyStatus.pending &&
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                            <AcceptButton loading={loading} onClick={() => verify(true)} />
                            <RejectButton loading={loading} onClick={() => verify(false)} />
                        </div>
                    }


                    {(user.role === role.organizer && (event.status === MyStatus.verified || event.status === MyStatus.running)) &&

                        <div>
                            {/* SECTIONS */}
                            <Collapse
                                items={[{ key: '1', label: 'Loại vé', children: <CreateSection eventId={event.id} status={event.status} name={event.name} /> }]}
                            />


                            {/* VOUCHERS */}
                            <Collapse
                                style={{ marginTop: 10 }}
                                items={[{ key: '2', label: 'Mã giảm giá', children: <Voucher eventId={event.id} /> }]}
                            />


                            {/* MERCHANDISE */}
                            <Collapse
                                style={{ marginTop: 10, marginBottom: '10vh' }}
                                items={[{ key: '3', label: 'Đồ lưu niệm', children: <Merchandise eventId={event.id} /> }]}
                            />
                        </div>
                    }

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
export default EventDetail;