import { Box, Input, Stack, Button, Typography, Select, Option, ListItemDecorator } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import ErrorDialog from "./layout/ErrorDialog";
import Apis, { banksApis, endpoints } from "../configs/Apis";
import { Form, Button as AntButton, Avatar } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import MySnackBar from "./layout/MySnackBar";

const RegisterOrganizer = () => {

    const [organizer, setOrganizer] = useState({});

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [openSuccessSnack, setOpenSuccessSnack] = useState(false);
    const [banks, setBanks] = useState([]);
    const logoRef = useRef();
    const licenseRef = useRef();
    const [logo, setLogo] = useState(null);
    const [license, setLicense] = useState(null);

    const validate = () => {
        return true;
    }

    const loadBanks = async () => {
        try {
            let res = await banksApis().get();
            setBanks(res.data.data);
        }
        catch (e) {
            setErrorMessage(e.message);
        }
    }

    const register = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                setLoading(true);

                let form = new FormData();
                form.append('name', organizer.name);
                form.append('taxCode', organizer.taxCode);
                form.append('bank', organizer.bank);
                form.append('bankNumber', organizer.bankNumber);
                form.append('email', organizer.email);
                form.append('phoneNumber', organizer.phoneNumber);
                form.append('address', organizer.address);
                form.append('description', organizer.description);

                if (logo) {
                    form.append('avatar', logoRef.current.files[0]);
                }

                if (license) {
                    form.append('license', licenseRef.current.files[0]);
                }

                let res = Apis.post(endpoints['organizerRegister'], form,
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

    useEffect(() => {
        loadBanks();
    }, []);

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
                    <Typography level="h3">Đăng Ký Ban Tổ chức</Typography>

                    <Form>
                        <Form.Item label="Tên công ty"  
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input width='50%' value={organizer.name} type="text" onChange={(e) => setOrganizer({ ...organizer, name: e.target.value })} />
                        </Form.Item>


                        <Form.Item label="Mã số thuế" 
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input width='50%' value={organizer.taxCode} type="tel" onChange={(e) => setOrganizer({ ...organizer, taxCode: e.target.value })} />
                        </Form.Item>



                        <Form.Item label="Ngân hàng" 
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Select
                                sx={{ '--ListItemDecorator-size': '44px', minWidth: 240 }}
                                onChange={(e, value) => setOrganizer({ ...organizer, bank: value })}
                            >
                                {banks.map((b) => (
                                    <Option key={b.id} value={b.name}>
                                        <ListItemDecorator>
                                            <Avatar size="sm" src={b.logo} />
                                        </ListItemDecorator>
                                        {b.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>



                        <Form.Item label="Số tài khoản" 
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input width='50%' value={organizer.bankNumber} type="tel" onChange={(e) => setOrganizer({ ...organizer, bankNumber: e.target.value })} />
                        </Form.Item>



                        <Form.Item label="Email" 
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input width='50%' value={organizer.email} type="email" onChange={(e) => setOrganizer({ ...organizer, email: e.target.value })} />
                        </Form.Item>



                        <Form.Item label="Số điện thoại" 
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input width='50%' value={organizer.phoneNumber} type="tel" onChange={(e) => setOrganizer({ ...organizer, phoneNumber: e.target.value })} />
                        </Form.Item>


                        <Form.Item label="Địa chỉ" 
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input width='50%' value={organizer.address} type="text" onChange={(e) => setOrganizer({ ...organizer, address: e.target.value })} />
                        </Form.Item>



                        <Form.Item label="Mô tả" 
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input width='50%' value={organizer.description} type="text" onChange={(e) => setOrganizer({ ...organizer, description: e.target.value })} />
                        </Form.Item>



                        <Form.Item label="Logo"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Stack direction='column'>
                                <Avatar size={200} src={logo && URL.createObjectURL(logo)} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={logoRef}
                                    onChange={() => setLogo(logoRef.current.files[0])}
                                    hidden
                                />
                                <AntButton onClick={() => logoRef.current.click()} icon={<UploadOutlined />}>Tải lên Logo</AntButton>

                            </Stack>
                        </Form.Item>



                        <Form.Item label="Giấy phép kinh doanh"
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
                                    <iframe title="Giấy phép kinh doanh"
                                        src={URL.createObjectURL(license)}
                                        width="100%"
                                        height="500px"
                                        style={{ border: '1px solid #ccc', marginTop: 10 }}
                                    />
                                )}

                                <AntButton onClick={() => licenseRef.current.click()} icon={<UploadOutlined />}>Tải lên Giấy phép kinh doanh</AntButton>

                            </Stack>
                        </Form.Item>

                        <Form.Item label="" 
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
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

export default RegisterOrganizer;
