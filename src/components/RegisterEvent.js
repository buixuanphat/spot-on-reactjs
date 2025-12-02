import { Box, Input, Stack, Button, Typography } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import ErrorDialog from "./layout/ErrorDialog";
import { Form, Button as AntButton, TimePicker, DatePicker, Image } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import MySnackBar from "./layout/MySnackBar";
import { useContext } from "react";
import { MyUserContext } from "../Contexts";
import { authApis, endpoints } from "../configs/Apis";

const RegisterEvent = () => {

    const [event, setEvent] = useState({});

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [openSuccessSnack, setOpenSuccessSnack] = useState(false);

    const imageRef = useRef();
    const licenseRef = useRef();
    const [image, setImage] = useState(null);
    const [license, setLicense] = useState(null);
    const [organizer, setOrganizer] = useState(null);

    const user = useContext(MyUserContext);

    const validate = () => {
        return true;
    }

    const getOrganizerByUser = async() =>
    {
        try
        {
            let res = await authApis().get(endpoints['getOrganizerByUser'](user.id));
            setOrganizer(res.data.data);
        }
        catch(e)
        {
            setErrorMessage(e.response?.data?.message || e.message);
            setOpenErrorDialog(true)
        }
    }

    const register = async (e) => {
        e.preventDefault();
        if (validate() && organizer) {
            try {
                setLoading(true);

                let form = new FormData();
                form.append('name', event.name);
                form.append('ageLimit', event.ageLimit);
                form.append('location', event.location);
                form.append('description', event.description);
                form.append('organizerId', organizer.id);
                form.append('startTime', event.startDate+'T'+event.startTime)
                form.append('endTime',event.endDate+'T'+event.endTime)

                if (image) {
                    form.append('image', imageRef.current.files[0]);
                }

                if (license) {
                    form.append('license', licenseRef.current.files[0]);
                }

                let res = authApis().post(endpoints['eventRegister'], form,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                )

                if ((await res).status === 200) {
                    setOpenSuccessSnack(true)
                    setTimeout(() => {
                        setOpenSuccessSnack(false);
                    }, 2000);
                }
            }
            catch (e) {
                setErrorMessage(e.response?.data?.message || e.message);
                setOpenErrorDialog(true)
            }
            finally {
                setLoading(false);
            }
        }
    }

    useEffect(()=>
    {
        getOrganizerByUser();
    },[]);

    return (
        <Box>
            <Stack
                direction="row"
                sx={{
                    width: "100%",

                }}
            >
                <Stack
                    spacing={2}
                    sx={{
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Typography level="h3">Đăng Ký Sự Kiện</Typography>

                    <Form>
                        <Form.Item label="Tên sự kiện"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Input width='50%' value={event.name} type="text" onChange={(e) => setEvent({ ...event, name: e.target.value })} />
                        </Form.Item>



                        <Form.Item label="Thời gian bắt đầu"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <DatePicker onChange={(e, v) => { setEvent({ ...event, startDate: v }) }} format='YYYY-MM-DD' />
                            <TimePicker onChange={(e, v) => { setEvent({ ...event, startTime: v }) }} format='HH:mm' />
                        </Form.Item>


                        <Form.Item label="Thời gian kết thúc"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <DatePicker onChange={(e, v) => { setEvent({ ...event, endDate: v }) }} format='YYYY-MM-DD' />
                            <TimePicker onChange={(e, v) => { setEvent({ ...event, endTime: v }) }} format='HH:mm' />
                        </Form.Item>


                        <Form.Item label="Địa điểm tổ chức"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Input width='50%' value={event.location} type="text" onChange={(e) => setEvent({ ...event, location: e.target.value })} />
                        </Form.Item>




                        <Form.Item label="Mô tả sự kiện"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Input width='50%' value={event.description} type="text" onChange={(e) => setEvent({ ...event, description: e.target.value })} />
                        </Form.Item>



                        <Form.Item label="Độ tuối giới hạn"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Input width='50%' value={event.ageLimit} type="number" onChange={(e) => setEvent({ ...event, ageLimit: e.target.value })} />
                        </Form.Item>




                        <Form.Item label="Hình ảnh"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Stack direction='column'>
                                <Image
                                    width={200}
                                    src={image ? URL.createObjectURL(imageRef.current.files[0]) : ''}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={imageRef}
                                    onChange={() => setImage(imageRef.current.files[0])}
                                    hidden
                                />
                                <AntButton onClick={() => imageRef.current.click()} icon={<UploadOutlined />}>Tải lên hình ảnh</AntButton>

                            </Stack>
                        </Form.Item>



                        <Form.Item label="Giấy phép tổ chức sự kiện"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Stack direction='column'>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    ref={licenseRef}
                                    onChange={() => setLicense(licenseRef.current.files[0])}
                                    hidden
                                />
                                {license && (
                                    <iframe title="Giấy phép tổ chức sự kiện"
                                        src={URL.createObjectURL(license)}
                                        width="100%"
                                        height="500px"
                                        style={{ border: '1px solid #ccc', marginTop: 10 }}
                                    />
                                )}

                                <AntButton onClick={() => licenseRef.current.click()} icon={<UploadOutlined />}>Tải lên Giấy phép tổ chức sự kiện</AntButton>

                            </Stack>
                        </Form.Item>

                        <Form.Item label=""
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Button onClick={(e) => register(e)} sx={{ mt: 2, width: "50%" }} loading={loading} >Đăng Ký</Button>
                        </Form.Item>


                    </Form>
                </Stack>
            </Stack>
            <ErrorDialog message={errorMessage} open={openErrorDialog} onClose={() => setOpenErrorDialog(false)} />
            <MySnackBar message="Đã gửi yêu cầu" open={openSuccessSnack} />
        </Box>
    );
};

export default RegisterEvent;
