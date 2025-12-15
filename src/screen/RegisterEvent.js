import { Box, Input, Stack, Button, Typography } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import ErrorDialog from "../components/ErrorDialog";
import { Form, Button as AntButton, TimePicker, DatePicker, Image, Select } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import MySnackBar from "../components/MySnackBar";
import { useContext } from "react";
import { MyUserContext } from "../Contexts";
import Apis, { authApis, endpoints, provinceApis } from "../configs/Apis";
import cookie from 'react-cookies'
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const RegisterEvent = () => {
    
    const token = cookie.load('token');

    const [event, setEvent] = useState({});

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [openSuccessSnack, setOpenSuccessSnack] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const imageRef = useRef();
    const licenseRef = useRef();
    const [image, setImage] = useState(null);
    const [license, setLicense] = useState(null);
    const [organizer, setOrganizer] = useState(null);

    const user = useContext(MyUserContext);


    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [province, setProvince] = useState();
    const [district, setDistrict] = useState();
    const [ward, setWard] = useState();

    const loadProvinces = async () => {
        try {
            let res = await provinceApis().get();
            setProvinces(res.data.map(p =>
            ({
                value: p.code,
                label: p.name,
            })
            ));
            setDistrict([]);
            setWard([]);
        }
        catch (e) {
            setErrorMessage(e.message);
            setOpenErrorDialog(true);
        }
    }

    const loadDistricts = async (provinceId) => {
        try {
            if (province) {
                let res = await provinceApis().get(`/p/${provinceId}?depth=2`);
                console.log(`/p/${province}?depth=2`)
                setDistricts(res.data.districts.map(d =>
                ({
                    value: d.name,
                    label: d.name,
                })
                ))
            }
        }
        catch (e) {
            setErrorMessage(e.message);
            setOpenErrorDialog(true);
        }
    }

    const loadWard = async () => {
        try {

        }
        catch (e) {
            setErrorMessage(e.message);
            setOpenErrorDialog(true);
        }
    }

    const validate = () => {
        return true;
    }

    const register = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                setLoading(true);

                let form = new FormData();
                form.append('name', event.name);
                form.append('ageLimit', event.ageLimit);
                form.append('adress', event.adress);
                form.append('province', event.province);
                form.append('district', event.district);
                form.append('ward', event.ward);
                form.append('description', event.description);
                form.append('organizerId', user.organizer.id);
                form.append('startTime', event.startDate + 'T' + event.startTime)
                form.append('endTime', event.endDate + 'T' + event.endTime)

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
                    setSuccessMessage('Đã gửi yêu cầu');
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

    useEffect(() => {
        loadProvinces();
    }, []);

    useEffect(() => {
        loadDistricts(province)
    }, [province]);

    return (
        <Box>

            <Stack
                spacing={2}
                sx={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 1
                }}
            >
                <Typography level="h3">Đăng Ký Sự Kiện</Typography>

                <Form style={{ width: '100%' }} >
                    <Form.Item label="Tên sự kiện"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <Input width='50%' value={event.name} type="text" onChange={(e) => setEvent({ ...event, name: e.target.value })} />
                    </Form.Item>



                    <Form.Item label="Thời gian bắt đầu"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <DatePicker onChange={(e, v) => { setEvent({ ...event, startDate: v }) }} format='YYYY-MM-DD' />
                        <TimePicker onChange={(e, v) => { setEvent({ ...event, startTime: v }) }} format='HH:mm' />
                    </Form.Item>


                    <Form.Item label="Thời gian kết thúc"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <DatePicker onChange={(e, v) => { setEvent({ ...event, endDate: v }) }} format='YYYY-MM-DD' />
                        <TimePicker onChange={(e, v) => { setEvent({ ...event, endTime: v }) }} format='HH:mm' />
                    </Form.Item>


                    <Form.Item label="Địa điểm tổ chức"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <Select
                            style={{ width: 120 }}
                            options={provinces}
                            onChange={(value) => setProvince(value)}
                        />
                        <Select
                            style={{ width: 120 }}
                            options={districts}
                            onChange={(value) => setWard(value)}
                        />
                        <Input sx={{ mt: 1 }} width='50%' value={event.location} type="text" onChange={(e) => setEvent({ ...event, location: e.target.value })} />
                    </Form.Item>




                    <Form.Item label="Mô tả sự kiện"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <Input width='50%' value={event.description} type="text" onChange={(e) => setEvent({ ...event, description: e.target.value })} />
                        <CKEditor
                            editor={ClassicEditor}
                            data={event.description}
                            onChange={(eventCK, editor) => {
                                const data = editor.getData();
                                setEvent({ ...event, description: data });
                            }}
                        />
                    </Form.Item>



                    <Form.Item label="Độ tuối giới hạn"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <Input width='50%' value={event.ageLimit} type="number" onChange={(e) => setEvent({ ...event, ageLimit: e.target.value })} />
                    </Form.Item>




                    <Form.Item label="Hình ảnh"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
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
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
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

                    <Form.Item label="Hành động"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <Button onClick={(e) => register(e)} sx={{ mt: 2, width: "50%" }} loading={loading} >Đăng Ký</Button>
                    </Form.Item>


                </Form>
            </Stack>

            <ErrorDialog message={errorMessage} open={openErrorDialog} onClose={() => setOpenErrorDialog(false)} />
            <MySnackBar message={successMessage} open={openSuccessSnack} />
        </Box>
    );
};

export default RegisterEvent;
