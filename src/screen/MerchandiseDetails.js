import { Alert, AspectRatio, Box, CircularProgress, Divider, Snackbar, Stack, Switch, Typography } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import ErrorDialog from "../components/ErrorDialog";
import { authApis, endpoints } from "../configs/Apis";
import { useParams } from "react-router-dom";
import { Avatar, Button, Form, Image, Input } from "antd";
import MySnackBar from "../components/MySnackBar";
import { useForm } from "antd/es/form/Form";
import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";



const MerchandiseDetail = () => {

    const params = useParams();

    const [form] = Form.useForm()

    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const [openSuccessSnack, setOpenSuccessSnack] = useState(false);

    const [updating, setUpdating] = useState(false)

    const imageRef = useRef();
    const [image, setImage] = useState(null);

    const fetchMerchandise = async () => {
        try {
            setLoading(true);
            let res = await authApis().get(endpoints['getMerchandise'](params.id));
            let merchandise = res.data.data
            form.setFieldValue("id", merchandise.id)
            form.setFieldValue("name", merchandise.name)
            form.setFieldValue("price", merchandise.price)
            form.setFieldValue("organizer", merchandise.organizer.name)
            form.setFieldValue("image", merchandise.image)
            console.log(res.data.data)
        }
        catch (e) {
            setErrorMessage(e.response?.data?.message || e.message)
            setOpenDialog(true);
        }
        finally {
            setLoading(false);
        }
    }

    const update = async (merchandise) => {
        try {
            setLoading(true)

            let formData = new FormData();
            formData.append('name', merchandise.name);
            formData.append('price', merchandise.price);


            if (image) {
                formData.append('image', imageRef?.current?.files[0]);
            }


            let res = await authApis().patch(endpoints['updateMerchandise'](merchandise.id), formData)

            if (res.status == 200) {
                setUpdating(false)
            }
            console.log(res.data)
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
        fetchMerchandise()
    }, [params.id]);





    return (
        <Box sx={{ width: '100%' }}>
            {loading && <CircularProgress style={{}} />}
            {!loading && !updating &&
                <Stack direction='column'>

                    <Typography level="h3" textAlign='center' my={2}>Thông tin đồ lưu niệm</Typography>
                    <Form form={form}>
                        <Form.Item label="ID"
                            name='id'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input disabled />
                        </Form.Item>


                        <Form.Item label="Tên"
                            name='name'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input disabled />
                        </Form.Item>


                        <Form.Item label="Giá"
                            name='price'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input type='number' disabled />
                        </Form.Item>


                        <Form.Item label="Hình ảnh"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            name='image'>
                            <Stack>
                                <AspectRatio ratio="1/1" sx={{ borderRadius: '12px', overflow: 'hidden', width: '50%' }}>
                                    {!image && <img
                                        src={form.getFieldValue("image")}
                                        loading="lazy"
                                        style={{ objectFit: 'cover' }}
                                    />}

                                    {image &&
                                        <img
                                            loading="lazy"
                                            style={{ objectFit: 'cover' }}
                                            src={image ? URL.createObjectURL(image) : ''}
                                        />
                                    }

                                </AspectRatio>
                            </Stack>

                        </Form.Item>



                        <Form.Item label="Đơn vị tổ chức"
                            name='organizer'
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


                        <Form.Item label="Tên"
                            name='name'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            rules={[{ required: true, message: 'T không được để trống' }]}>
                            <Input disabled={!updating} />
                        </Form.Item>


                        <Form.Item label="Giá"
                            name='price'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            rules={[{ required: true, message: 'Giá không được để trống' }]}>
                            <Input type='number' disabled={!updating} />
                        </Form.Item>


                        <Form.Item label="Hình ảnh"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            name='image'>
                            <Stack>
                                <AspectRatio ratio="1/1" sx={{ borderRadius: '12px', overflow: 'hidden', width: '50%' }}>
                                    {!image &&
                                        <img
                                            src={form.getFieldValue("image")}
                                            loading="lazy"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    }
                                    {image &&
                                        <img
                                            loading="lazy"
                                            style={{ objectFit: 'cover' }}
                                            src={image ? URL.createObjectURL(image) : ''}
                                        />
                                    }
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={imageRef}
                                        onChange={() => {
                                            setImage(imageRef?.current?.files[0])
                                            form.setFieldValue("image", imageRef?.current?.files[0])
                                        }}
                                        hidden
                                    />

                                </AspectRatio>
                                <Button style={{ width: 200 }} onClick={() => imageRef.current.click()} icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
                            </Stack>
                        </Form.Item>


                        <Form.Item label="Đơn vị tổ chức"
                            name='organizer'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Input disabled />
                        </Form.Item>


                        <Form.Item label="Hành động"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}>
                            <Button htmlType="submit" color="primary" variant="solid" loading={loading}>Lưu</Button>
                            <Button color="danger" variant="solid" loading={loading} onClick={() => setUpdating(false)} style={{ marginLeft: '10px' }} >Hủy</Button>
                        </Form.Item>

                    </Form>
                </Stack>
            }

            <ErrorDialog open={openDialog} message={errorMessage} onClose={() => setOpenDialog(false)} />
            <MySnackBar message={successMessage} open={openSuccessSnack} />
        </Box>

    );
}


export default MerchandiseDetail;