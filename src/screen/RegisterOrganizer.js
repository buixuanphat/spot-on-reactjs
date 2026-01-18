import { Stack, Typography } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import ErrorDialog from "../components/ErrorDialog";
import Apis, { banksApis, endpoints, provinceApis } from "../configs/Apis";
import { Form, Button as AntButton, Avatar, Input, Select, Button } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import MySnackBar from "../components/MySnackBar";
import { useNavigate } from "react-router-dom";

const RegisterOrganizer = () => {

    const nav = useNavigate()

    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [openSuccessSnack, setOpenSuccessSnack] = useState(false);
    const [banks, setBanks] = useState([]);
    const logoRef = useRef();
    const licenseRef = useRef();
    const [logo, setLogo] = useState(null);
    const [license, setLicense] = useState(null);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [province, setProvince] = useState();
    const [district, setDistrict] = useState();
    const [ward, setWard] = useState();

    const loadProvinces = async () => {
        try {
            let res = await provinceApis().get();
            res.data && setProvinces(res.data.map(p =>
            ({
                value: p.code,
                label: p.name,
            })
            ));
        }
        catch (e) {
            setErrorMessage("Lỗi khi tải thông tin Tỉnh/Thành phố" + e.message);
            setOpenErrorDialog(true);
        }
    }

    const loadDistricts = async (provinceId) => {
        try {
            if (provinceId) {
                let res = await provinceApis().get(`/p/${provinceId}?depth=2`);
                res.data.districts && setDistricts(res.data.districts.map(d =>
                ({
                    value: d.code,
                    label: d.name,
                })
                ))
            }
        }
        catch (e) {
            setErrorMessage("Lỗi khi tải thông tin Quận/Huyện" + e.message);
            setOpenErrorDialog(true);
        }
    }

    const loadWards = async (districtId) => {
        try {
            if (districtId) {
                let res = await provinceApis().get(`/d/${districtId}?depth=2`);
                res.data.wards && setWards(res.data.wards.map(w =>
                ({
                    value: w.code,
                    label: w.name,
                })
                ))
            }
        }
        catch (e) {
            setErrorMessage("Lỗi khi tải thông tin Phường/Xã" + e.message);
            setOpenErrorDialog(true);
        }
    }

    useEffect(() => {
        loadProvinces();
    }, []);

    const loadBanks = async () => {
        try {
            let res = await banksApis().get();
            let data = res.data.data
            let result = []
            data.map(d =>
                result = [...result, {
                    value: d.name,
                    label: d.name
                }]
            )
            setBanks(result);
        }
        catch (e) {
            console.log(e)
        }
    }

    const register = async (organizer) => {
        try {
            setLoading(true);

            let form = new FormData();
            form.append('name', organizer.name);
            form.append('taxCode', organizer.taxCode);
            form.append('bank', organizer.bank);
            form.append('bankNumber', organizer.bankNumber);
            form.append('email', organizer.email);
            form.append('phoneNumber', organizer.phoneNumber);
            form.append('address', `${organizer.address}, ${organizer.province}, ${organizer.district}, ${organizer.ward}`);
            form.append('description', organizer.description);

            if (logo) {
                form.append('avatar', logoRef.current.files[0]);
            }

            if (license) {
                form.append('license', licenseRef.current.files[0]);
            }

            let res = await Apis.post(endpoints['organizerRegister'], form,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )
            if (res.status === 200) {
                setOpenSuccessSnack(true)
                setTimeout(() => {
                    setOpenSuccessSnack(false);
                    nav('/')
                }, 2000);

            }
        }
        catch (e) {
            console.log(e)
            setErrorMessage(e.response?.data?.message || "Đã có lỗi xảy ra");
            setOpenErrorDialog(true)
        }
        finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        loadBanks();
    }, []);

    return (
        <div style={{
            padding: '50px'
        }}>
            <Typography textAlign='center' margin='10px' level="h3">Đăng Ký Ban Tổ chức</Typography>

            <Form
                form={form}
                onFinish={register}>
                <Form.Item label="Tên công ty"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    name="name"
                    rules={[{ required: true, message: 'Tên không được để trống' }]}>
                    <Input />
                </Form.Item>


                <Form.Item label="Mã số thuế"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    name="taxCode"
                    rules={[{ required: true, message: 'Mã số thuế không được để trống' }]}>
                    <Input type='number' />
                </Form.Item>



                <Form.Item label="Ngân hàng"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    name="bank"
                    rules={[{ required: true, message: 'Ngân hàng không được để trống' }]}>
                    <Select
                        options={banks}
                        onChange={(value) => form.setFieldValue("bank", value)}
                    />
                </Form.Item>



                <Form.Item label="Số tài khoản"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    name="bankNumber"
                    rules={[{ required: true, message: 'Số tài khoản không được để trống' }]}>
                    <Input type='number' />
                </Form.Item>



                <Form.Item label="Email"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    name="email"
                    rules={[{ required: true, message: 'Email không được để trống' }]}>
                    <Input type='email' />
                </Form.Item>



                <Form.Item label="Số điện thoại"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    name="phoneNumber"
                    rules={[{ required: true, message: 'Số điện thoại không được để trống' }]}>
                    <Input type='tel' />
                </Form.Item>


                <Form.Item label="Tỉnh/Thành phố"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    name="province"
                    rules={[{ required: true, message: 'Tỉnh/Thành phố không được để trống' }]}
                >
                    <Select
                        labelInValue
                        style={{ width: 300 }}
                        options={provinces}
                        onChange={(p) => {
                            setProvince(p.value)
                            form.setFieldValue("province", p.label)
                            setDistrict(undefined);
                            setWard(undefined);
                            setDistricts([]);
                            setWards([]);
                            form.resetFields(["district", "ward"]);
                            loadDistricts(p.value);
                        }}

                    />
                </Form.Item>

                <Form.Item label="Quận/Huyện"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    name="district"
                    rules={[{ required: true, message: 'Quận/Huyện không được để trống' }]}
                >
                    <Select
                        labelInValue
                        style={{ width: 300 }}
                        options={districts}
                        onChange={(d) => {
                            setDistrict(d.value)
                            form.setFieldValue("district", d.label)
                            setWards([]);
                            setWard();
                            form.resetFields(["ward"]);
                            loadWards(d.value);
                        }}
                    />
                </Form.Item>

                <Form.Item label="Phường/Xã"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    name="ward"
                    rules={[{ required: true, message: 'Phường/Xã không được để trống' }]}>
                    <Select
                        labelInValue
                        style={{ width: 300 }}
                        options={wards}
                        onChange={(w) => {
                            setWard(w.value)
                            form.setFieldValue("ward", w.label)
                        }}
                    />
                </Form.Item>


                <Form.Item label="Địa chỉ"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    name="address"
                    rules={[{ required: true, message: 'Địa chỉ không được để trống' }]}>
                    <Input />
                </Form.Item>



                <Form.Item label="Mô tả"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    name="description"
                    rules={[{ required: true, message: 'Mô tả không được để trống' }]}>
                    <Input />
                </Form.Item>



                <Form.Item label="Logo"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    name="avatar"
                    rules={[{ required: true, message: 'Logo không được để trống' }]}>
                    <Stack direction='column'>
                        <Avatar style={{ margin: '10px' }} size={200} src={logo && URL.createObjectURL(logo)} />
                        <input
                            type="file"
                            accept="image/*"
                            ref={logoRef}
                            onChange={() => {
                                setLogo(logoRef.current.files[0])
                                form.setFieldValue("avatar", logoRef.current.files[0])
                            }}
                            hidden
                        />
                        <AntButton style={{ width: '50%' }} onClick={() => logoRef.current.click()} icon={<UploadOutlined />}>Tải lên Logo</AntButton>
                    </Stack>
                </Form.Item>



                <Form.Item label="Giấy phép kinh doanh"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    name="businessLicense"
                    rules={[{ required: true, message: 'Giấy phép kinh doanh không được để trống' }]}>
                    <Stack direction='column'>
                        <input
                            type="file"
                            accept="application/pdf"
                            ref={licenseRef}
                            onChange={() => {
                                setLicense(licenseRef.current.files[0])
                                form.setFieldValue("businessLicense", licenseRef.current.files[0])
                            }}
                            hidden
                        />
                        {license && (
                            <iframe title="Giấy phép kinh doanh"
                                src={URL.createObjectURL(license)}
                                width="50%"
                                height="500px"
                                style={{ border: '1px solid #ccc', marginTop: 10 }}
                            />
                        )}

                        <AntButton style={{ width: '50%' }} onClick={() => licenseRef.current.click()} icon={<UploadOutlined />}>Tải lên Giấy phép kinh doanh</AntButton>

                    </Stack>
                </Form.Item>

                <Form.Item label="Hành động"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}>
                    <Button type="primary" variant="solid" htmlType="submit" loading={loading} >Đăng Ký</Button>
                </Form.Item>
            </Form>

            <ErrorDialog message={errorMessage} open={openErrorDialog} onClose={() => setOpenErrorDialog(false)} />
            <MySnackBar message="Đã gửi yêu cầu" open={openSuccessSnack} />
        </div>
    );
};

export default RegisterOrganizer;
