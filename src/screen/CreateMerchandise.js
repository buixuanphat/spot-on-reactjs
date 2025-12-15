import { Box, Input, Stack, Button, Typography } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import ErrorDialog from "../components/ErrorDialog";
import { Form, Button as AntButton, TimePicker, DatePicker, Image } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import MySnackBar from "../components/MySnackBar";
import { useContext } from "react";
import { MyUserContext } from "../Contexts";
import { authApis, endpoints } from "../configs/Apis";

const CreateMerchandise = () => {

    const [merchandise, setMerchandise] = useState({});

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [openSuccessSnack, setOpenSuccessSnack] = useState(false);

    const imageRef = useRef();
    const [image, setImage] = useState(null);
    const [organizer, setOrganizer] = useState(null);

    const user = useContext(MyUserContext);

    const validate = () => {
        return true;
    }


    const create = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                setLoading(true);

                let form = new FormData();
                form.append('name', merchandise.name);
                form.append('organizerId', user.organizer.id);
                form.append('price', merchandise.price)

                if (image) {
                    form.append('image', imageRef.current.files[0]);
                }

                let res = authApis().post(endpoints['createMerchandise'], form,
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
                    <Typography level="h3">Tạo đồ lưu niệm</Typography>

                    <Form>
                        <Form.Item label="Tên"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Input width='50%' value={merchandise.name} type="text" onChange={(e) => setMerchandise({ ...merchandise, name: e.target.value })} />
                        </Form.Item>




                        <Form.Item label="Giá"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Input width='50%' value={merchandise.price} type="number" onChange={(e) => setMerchandise({ ...merchandise, price : e.target.value })} />
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



                        <Form.Item label=""
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}>
                            <Button onClick={(e) => create(e)} sx={{ mt: 2, width: "50%" }} loading={loading} >Tạo</Button>
                        </Form.Item>


                    </Form>
                </Stack>
            </Stack>
            <ErrorDialog message={errorMessage} open={openErrorDialog} onClose={() => setOpenErrorDialog(false)} />
            <MySnackBar message="Đã tạo đồ lưu niệm" open={openSuccessSnack} />
        </Box>
    );
};

export default CreateMerchandise;
