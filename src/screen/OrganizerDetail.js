import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import ErrorDialog from "../components/ErrorDialog";
import { authApis, banksApis, endpoints, provinceApis } from "../configs/Apis";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import { Avatar, Form, Input, Button, Select, message } from "antd";
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import MySnackBar from "../components/MySnackBar";
import { MyColor } from "../configs/Enum";
import { UploadOutlined } from "@ant-design/icons";

const OrganizerDetail = () => {

    const nav = useNavigate()

    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const params = useParams();

    const [successMessage, setSuccessMessage] = useState(null);
    const [openSuccessSnack, setOpenSuccessSnack] = useState(false);

    const [form] = Form.useForm()

    const [editing, setEditing] = useState(false)

    const [bank, setBanks] = useState([])
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [province, setProvince] = useState();
    const [district, setDistrict] = useState();
    const [ward, setWard] = useState();

    const logoRef = useRef();
    const licenseRef = useRef();
    const [logo, setLogo] = useState(null);
    const [license, setLicense] = useState(null);

    const status = [
        {
            label: 'Chờ xác thực',
            value: 'pending'
        },
        {
            label: 'Đã xác thực',
            value: 'verified'
        },
        {
            label: 'Đã từ chối',
            value: 'rejected'
        }
    ]

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
            if (e.response?.data?.message) {
                setErrorMessage(e.response?.data?.message)
                setOpenDialog(true);
            }
            console.log(e)
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
            if (e.response?.data?.message) {
                setErrorMessage(e.response?.data?.message)
                setOpenDialog(true);
            }
            console.log(e)
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
            if (e.response?.data?.message) {
                setErrorMessage(e.response?.data?.message)
                setOpenDialog(true);
            }
            console.log(e)
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
            if (e.response?.data?.message) {
                setErrorMessage(e.response?.data?.message)
                setOpenDialog(true);
            }
            console.log(e)
        }
    }


    const fetchOrganizer = async () => {
        try {
            setLoading(true);
            let res = await authApis().get(endpoints['getOrganizer'](params.id));
            const organizer = res.data.data
            form.setFieldValue('id', organizer.id)
            form.setFieldValue('name', organizer.name)
            form.setFieldValue('email', organizer.email)
            form.setFieldValue('taxCode', organizer.taxCode)
            form.setFieldValue('phoneNumber', organizer.phoneNumber)
            form.setFieldValue('bank', organizer.bank)
            form.setFieldValue('bankNumber', organizer.bankNumber)

            form.setFieldValue('description', organizer.description)
            form.setFieldValue('createdDate', organizer.createdDate)
            form.setFieldValue('status', organizer.status)
            form.setFieldValue('avatar', organizer.avatar)
            form.setFieldValue('businessLicense', organizer.businessLicense)

            const address = organizer.address
                .split(',')
                .map(item => item.trim())

            form.setFieldValue('address', address[0])
            setProvince(address[1])
            setDistrict(address[2])
            setWard(address[3])


        }
        catch (e) {
            if (e.response?.data?.message) {
                setErrorMessage(e.response?.data?.message)
                setOpenDialog(true);
            }
            console.log(e)
        }
        finally {
            setLoading(false);
        }
    }


    const update = async (organizer) => {
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
            form.append('status', organizer.status)

            if (logo) {
                form.append('avatar', logoRef.current.files[0]);
            }

            if (license) {
                form.append('license', licenseRef.current.files[0]);
            }

            let res = await authApis().patch(endpoints['updateOrganizer'](organizer.id), form,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            if (res.status === 200) {
                setEditing(false)
                setSuccessMessage("Cập nhật thành công")
                setOpenSuccessSnack(true)
                setTimeout(() => {
                    setOpenSuccessSnack(false);
                }, 2000);

            }
        }
        catch (e) {
            console.log(e)
            setErrorMessage(e.response?.data?.message || "Đã có lỗi xảy ra");
            setOpenDialog(true)
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
            let res = authApis().patch(endpoints['verifyOrganizer'](params.id), null,
                {
                    params: {
                        'accept': accept
                    }
                });
            if ((await res).status == 200) {
                setSuccessMessage("Xác thực thành công")
                setOpenSuccessSnack(true)
                setTimeout(() => {
                    setOpenSuccessSnack(false);
                    nav('/organizers')
                }, 2000);
            }
        }
        catch (e) {
            if (e.response?.data?.message) {
                setErrorMessage(e.response?.data?.message)
                setOpenDialog(true);
            }
            console.log(e)
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ margin: '50px' }}>
            {loading && <CircularProgress style={{}} />}
            {!loading && form ?
                <Stack direction='column'>
                    <Typography marginBottom='10px' level="h3" textAlign='center' >Thông tin Ban tổ chức</Typography>
                    <Form
                        form={form}
                        onFinish={update}>
                        <Form.Item label="ID"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            name="id">
                            <Input disabled='true' />
                        </Form.Item>


                        <Form.Item label="Tên Ban tổ chức"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            name="name"
                            rules={[{ required: true, message: 'Tên không được để trống' }]}>
                            <Input disabled={!editing} />
                        </Form.Item>


                        <Form.Item label="Email"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            name="email"
                            rules={[{ required: true, message: 'Email không được để trống' }]}>
                            <Input disabled={!editing} />
                        </Form.Item>


                        <Form.Item label="Mã số thuế"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            name="taxCode"
                            rules={[{ required: true, message: 'Mã số thuế không được để trống' }]}>
                            <Input disabled={!editing} />
                        </Form.Item>


                        <Form.Item label="Số điện thoại"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            name="phoneNumber"
                            rules={[{ required: true, message: 'Số điện thoại không được để trống' }]}>
                            <Input disabled={!editing} />
                        </Form.Item>


                        <Form.Item label="Ngân hàng"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            name="bank"
                            rules={[{ required: true, message: 'Ngân hàng không được để trống' }]}>
                            <Input disabled='true' />
                        </Form.Item>


                        <Form.Item label="Số tài khoản"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            name="bankNumber"
                            rules={[{ required: true, message: 'Số tài khoản không được để trống' }]}>
                            <Input disabled={!editing} />
                        </Form.Item>

                        {editing &&
                            <div>
                                <Form.Item label="Tỉnh/Thành phố"
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                    name="province">
                                    <Select
                                        defaultValue={province}
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
                                    name="district">
                                    <Select
                                        defaultValue={district}
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
                                    name="ward">
                                    <Select
                                        defaultValue={ward}
                                        labelInValue
                                        style={{ width: 300 }}
                                        options={wards}
                                        onChange={(w) => {
                                            setWard(w.value)
                                            form.setFieldValue("ward", w.label)
                                        }}
                                    />
                                </Form.Item>
                            </div>
                        }




                        <Form.Item label="Địa chỉ"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            name="address"
                            rules={[{ required: true, message: 'Địa chỉ không được để trống' }]}>
                            <Input disabled={!editing} />
                        </Form.Item>



                        <Form.Item label="Mô tả"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            name="description"
                            rules={[{ required: true, message: 'Mô tả không được để trống' }]}>
                            <Input disabled={!editing} />
                        </Form.Item>


                        <Form.Item label="Ngày tạo"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            name='createdDate'>
                            <Input disabled='true' />
                        </Form.Item>


                        <Form.Item label="Trạng thái"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            name="status"
                            rules={[{ required: true, message: 'Trạng thái không được để trống' }]}>
                            <Select
                                style={{ width: 120 }}
                                disabled={!editing}
                                options={status}
                            />
                        </Form.Item>


                        <Form.Item
                            label="Logo"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            name="avatar"
                        >
                            <Stack direction='column'>

                                <Avatar
                                    style={{ margin: '10px' }}
                                    size={200}
                                    src={logo ? URL.createObjectURL(logo) : form.getFieldValue('avatar')}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={logoRef}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setLogo(file);
                                            form.setFieldValue("avatar", file);
                                        }
                                    }}
                                    hidden
                                />
                                {editing && <Button style={{width:'50%'}} onClick={() => logoRef.current.click()} icon={<UploadOutlined />}>Tải lên Logo</Button>}
                            </Stack>
                        </Form.Item>


                        <Form.Item
                            label="Giấy phép kinh doanh"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                        >
                            <Stack direction='column'>
                                <iframe
                                    src={license ? URL.createObjectURL(license) : form.getFieldValue('businessLicense')}
                                    width="50%"
                                    height="500px"
                                    style={{ border: '1px solid #ccc', marginTop: 10 }}
                                />
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    ref={licenseRef}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setLicense(file);
                                            form.setFieldValue("businessLicense", file);
                                        }
                                    }}
                                    hidden
                                />
                                {editing && <Button style={{width:'50%'}} onClick={() => licenseRef.current.click()} icon={<UploadOutlined />}>Tải lên Giấy phép</Button>}
                            </Stack>
                        </Form.Item>

                        <Form.Item
                            label='Hành động'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            {form.getFieldValue('status') === 'pending' ?
                                <Stack direction='row'>
                                    <Button variant="solid" onClick={() => verify(true)} loading={loading} color="green" >Chấp nhận</Button>
                                    <Button variant="solid" onClick={() => verify(false)} loading={loading} color="danger" >Từ chối</Button>
                                </Stack> :
                                <Box>
                                    {editing && <Button htmlType="submit" variant="solid" color="primary">Lưu</Button>}
                                    {!editing && <Button variant="solid" color="orange" htmlType="button" onClick={(event) => {
                                        event.preventDefault()
                                        setEditing(true)
                                    }}>Chỉnh sửa</Button>}
                                </Box>
                            }
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
        </div>
    );

}
export default OrganizerDetail;