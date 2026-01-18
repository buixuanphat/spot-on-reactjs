import { Alert, AspectRatio, Box, CircularProgress, Divider, Snackbar, Stack, Switch, Typography } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import ErrorDialog from "../components/ErrorDialog";
import { authApis, endpoints } from "../configs/Apis";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Button, DatePicker, Form, Image, Input, Select } from "antd";
import MySnackBar from "../components/MySnackBar";
import { useForm } from "antd/es/form/Form";
import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";



const VoucherDetails = () => {

    const params = useParams();

    const [form] = Form.useForm()

    const [loading, setLoading] = useState(false);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const [openSuccessSnack, setOpenSuccessSnack] = useState(false);

    const [updating, setUpdating] = useState(false)


    const fetchVoucher = async () => {
        try {
            setLoading(true);
            let res = await authApis().get(endpoints['getVoucher'](params.id));
            let voucher = res.data.data
            form.setFieldValue("id", voucher.id)
            form.setFieldValue("code", voucher.code)
            form.setFieldValue("effectiveDate", dayjs(voucher.effectiveDate, "YYYY-MM-DD"))
            form.setFieldValue("expirationDate", dayjs(voucher.expirationDate, "YYYY-MM-DD"))
            form.setFieldValue("description", voucher.description)
            form.setFieldValue("limitUsed", voucher.limitUsed)
            form.setFieldValue("type", voucher.type)
            form.setFieldValue("value", voucher.value)
            form.setFieldValue("tier", voucher.tier)
        }
        catch (e) {
            setErrorMessage(e.response?.data?.message || e.message)
            setOpenErrorDialog(true);
        }
        finally {
            setLoading(false);
        }
    }

    const validate = (voucher) => {
        if (voucher.expirationDate.isBefore(voucher.effectiveDate)) {
            setErrorMessage("Thời gian bắt đầu phải trước thời gian kết thúc");
            setOpenErrorDialog(true)
            return false;
        }
        return true;
    };


    const type = [
        {
            label: 'Tỷ lệ phần trăm',
            value: 'percent'
        },
        {
            label: 'Số tiền',
            value: 'amount'
        }
    ]


    const update = async (voucher) => {
        if (validate(voucher)) {
            try {
                setLoading(true)

                const payload = {
                    ...voucher,
                    effectiveDate: voucher.effectiveDate
                        ? voucher.effectiveDate.format("YYYY-MM-DD[T]HH:mm")
                        : null,
                    expirationDate: voucher.expirationDate
                        ? voucher.expirationDate.format("YYYY-MM-DD[T]HH:mm")
                        : null,
                };

                console.log(payload)

                let res = await authApis().patch(endpoints['updateVoucher'](voucher.id), payload)

                if (res.status == 200) {
                    setUpdating(false)
                    setSuccessMessage("Cập nhật thành công")
                    setOpenSuccessSnack(true)
                    setTimeout(() => {
                        setOpenSuccessSnack(false)
                    }, 2000)
                }
                console.log(res.data)
            }
            catch (e) {
                setErrorMessage(e.response?.data?.message || e.message)
                setOpenErrorDialog(true);
            }
            finally {
                setLoading(false);
            }
        }
    }


    useEffect(() => {
        fetchVoucher()
    }, [params.id]);


    const tier = [
        {
            label: 'Đồng',
            value: 'copper'
        },
        {
            label: 'Bạc',
            value: 'silver'
        },
        {
            label: 'Vàng',
            value: 'gold'
        }
    ]




    return (
        <Box sx={{ width: '100%' }}>
            {loading && <CircularProgress style={{}} />}
            {!loading && !updating &&
                <Stack direction='column'>

                    <Typography level="h3" textAlign='center' my={2}>Thông tin mã giảm giá</Typography>
                    <Form form={form}>
                        <Form.Item label="ID"
                            name='id'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input disabled />
                        </Form.Item>


                        <Form.Item label="Mã"
                            name='code'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input disabled />
                        </Form.Item>


                        <Form.Item label="Mô tả"
                            name='description'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input disabled />
                        </Form.Item>


                        <Form.Item label="Ngày có hiệu lực"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            name='effectiveDate'>
                            <DatePicker disabled />

                        </Form.Item>


                        <Form.Item label="Ngày hết hạn"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            name='expirationDate'>
                            <DatePicker disabled />

                        </Form.Item>



                        <Form.Item label="Giới hạn số lần sử dụng"
                            name='limitUsed'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input disabled />
                        </Form.Item>


                        <Form.Item label="Loại giảm giá"
                            name='type'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input disabled />
                        </Form.Item>


                        <Form.Item label="Tỷ lệ giảm giá"
                            name='value'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input disabled type='number' />
                        </Form.Item>


                        <Form.Item label="Hạng thành viên"
                            name='tier'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input disabled />
                        </Form.Item>


                        <Form.Item label="Hành động"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Button color="orange" variant="solid" onClick={() => { setUpdating(true) }} >Chỉnh sửa</Button>
                        </Form.Item>

                    </Form>
                </Stack>}


            {updating &&
                <Stack direction='column'>

                    <Typography level="h3" textAlign='center' my={2}>Thông tin đồ lưu niệm</Typography>
                    <Form form={form} onFinish={update}>
                        <Form.Item label="ID"
                            name='id'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input disabled />
                        </Form.Item>


                        <Form.Item label="Mã"
                            name='code'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            rules={[{ required: true, message: 'Mã giảm giá không được để trống' }]}>
                            <Input />
                        </Form.Item>


                        <Form.Item label="Mô tả"
                            name='description'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            rules={[{ required: true, message: 'Mô tả không được để trống' }]}>
                            <Input />
                        </Form.Item>


                        <Form.Item label="Ngày có hiệu lực"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            name='effectiveDate'
                            rules={[{ required: true, message: 'Ngày có hiệu lực không được để trống' }]}>
                            <DatePicker />

                        </Form.Item>


                        <Form.Item label="Ngày hết hạn"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            name='expirationDate'
                            rules={[{ required: true, message: 'Ngày hết hạn không được để trống' }]}>
                            <DatePicker />

                        </Form.Item>



                        <Form.Item label="Giới hạn số lần sử dụng"
                            name='limitUsed'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            rules={[{ required: true, message: 'Giới hạn số lần sử dụng không được để trống' }]}>
                            <Input />
                        </Form.Item>


                        <Form.Item label="Loại giảm giá"
                            name='type'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            rules={[{ required: true, message: 'Loại giảm giá không được để trống' }]}>
                            <Select
                                style={{ width: 300 }}
                                options={type}
                                onChange={(value) => {
                                    form.setFieldValue("type", value)
                                }}
                            />
                        </Form.Item>


                        <Form.Item label="Tỷ lệ giảm giá"
                            name='value'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            rules={[{ required: true, message: 'Tỷ lệ giảm giá không được để trống' }]}>
                            <Input type='number' />
                        </Form.Item>


                        <Form.Item label="Hạng thành viên"
                            name='tier'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Select
                                style={{ width: 300 }}
                                options={tier}
                                onChange={(value) => {
                                    form.setFieldValue("tier", value)
                                }}
                            />
                        </Form.Item>


                        <Form.Item label="Hành động"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Button color="primary" variant="solid" htmlType="submit">Lưu</Button>
                            <Button color="danger" variant="solid" onClick={() => { setUpdating(false) }} style={{ marginLeft: '10px' }}>Hủy</Button>
                        </Form.Item>

                    </Form>
                </Stack>
            }

            <ErrorDialog open={openErrorDialog} message={errorMessage} onClose={() => setOpenErrorDialog(false)} />
            <MySnackBar message={successMessage} open={openSuccessSnack} />
        </Box >

    );
}


export default VoucherDetails;