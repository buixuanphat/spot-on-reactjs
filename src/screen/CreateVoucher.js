import { Box, Stack, Typography } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import ErrorDialog from "../components/ErrorDialog";
import { Form, Button as AntButton, TimePicker, DatePicker, Image, Select, Input } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import MySnackBar from "../components/MySnackBar";
import { useContext } from "react";
import { MyUserContext } from "../Contexts";
import Apis, { authApis, endpoints, provinceApis } from "../configs/Apis";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";

const CreateVoucher = () => {




    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [openSuccessSnack, setOpenSuccessSnack] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const user = useContext(MyUserContext);

    const nav = useNavigate();

    const [form] = Form.useForm()

    const validate = (voucher) => {
        if (voucher.expirationDate.isBefore(voucher.effectiveDate)) {
            setErrorMessage("Thời gian bắt đầu phải trước thời gian kết thúc");
            setOpenErrorDialog(true)
            return false;
        }
        return true;
    };


    const create = async (voucher) => {
        if (validate(voucher)) {
            try {
                setLoading(true);

                const payload = {
                    ...voucher,
                    effectiveDate: voucher.effectiveDate
                        ? voucher.effectiveDate.format("YYYY-MM-DD[T]HH:mm")
                        : null,
                    expirationDate: voucher.expirationDate
                        ? voucher.expirationDate.format("YYYY-MM-DD[T]HH:mm")
                        : null,
                    organizerId: user.organizer.id,
                };

                console.log(payload);

                let res = await authApis().post(endpoints['createVoucher'], payload);

                if (res.status === 200) {
                    setSuccessMessage('Đã tạo thành công');
                    nav('/vouchers');
                    setOpenSuccessSnack(true);
                    setTimeout(() => setOpenSuccessSnack(false), 2000);
                }
            }
            catch (e) {
                setErrorMessage(e.response?.data?.message || e.message);
                setOpenErrorDialog(true);
            }
            finally {
                setLoading(false);
            }
        }

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
                <Typography level="h3">Tạo mã giảm giá</Typography>

                <Form style={{ width: '100%' }}
                    onFinish={create}
                    form={form}>

                    <Form.Item
                        label="Mã"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="code"
                        rules={[{ required: true, message: 'Mã không được để trống' }]}>
                        <Input />
                    </Form.Item>



                    <Form.Item
                        label="Mô tả"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="description"
                        rules={[{ required: true, message: 'Mô tả không được để trống' }]}
                    >
                        <Input />
                    </Form.Item>




                    <Form.Item label="Ngày có hiệu lực"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="effectiveDate"
                        rules={[{ required: true, message: 'Ngày có hiệu lực không được để trống' }]}
                    >
                        <DatePicker />
                    </Form.Item>


                    <Form.Item label="Ngày hết hạn"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="expirationDate"
                        rules={[{ required: true, message: 'Ngày hết hạn không được để trống' }]}
                    >
                        <DatePicker />
                    </Form.Item>




                    <Form.Item label="Giới hạn số lần sử dụng"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        rules={[{ required: true, message: 'Giới hạn số lần sử dụng không được để trống' }]}
                        name="limitUsed">
                        <Input type='number' />
                    </Form.Item>



                    <Form.Item label="Loại giảm giá"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="type"
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
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="value"
                        rules={[{ required: true, message: 'Tỷ lệ giảm giá không được để trống' }]}>
                        <Input type='number' />
                    </Form.Item>


                    <Form.Item label="Hạng thành viên"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="tier">
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
                        <AntButton type="primary" htmlType="submit" sx={{ mt: 2, width: "50%" }} loading={loading} >Tạo</AntButton>
                    </Form.Item>


                </Form>
            </Stack>

            <ErrorDialog message={errorMessage} open={openErrorDialog} onClose={() => setOpenErrorDialog(false)} />
            <MySnackBar message={successMessage} open={openSuccessSnack} />
        </Box>
    );
};

export default CreateVoucher;
