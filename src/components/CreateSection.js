import { Box, Snackbar, Typography } from "@mui/joy";
import { ColorPicker, Form, Input, Button as AntButton, Divider, QRCode, Button } from "antd";
import { useEffect, useState } from "react";
import ErrorDialog from "./ErrorDialog";
import { authApis, endpoints } from "../configs/Apis";
import AddIcon from '@mui/icons-material/Add';
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { MyStatus } from "../configs/Enum";
import { MyColor } from "../configs/Enum";
import logo from "../assets/spoton_logo.png";
import AddButton from "./AddButton";
import SaveButton from "./SaveButton";
import CloseButton from "./CloseButton";
import MySection from "./MySection";


const CreateSection = ({ eventId, status, name }) => {

    const [sections, setSections] = useState([]);

    const [displayErrorDialog, setDisplayErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [displaySuccessSnack, setDisplaySuccessSnack] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [loadingSections, setLoadingSections] = useState(false);
    const [loadingSection, setLoadingSection] = useState(false);
    const [creating, setCreating] = useState(false);

    const [form] = Form.useForm();

    const createSection = async (section) => {
        try {
            setLoadingSection(true);
            let res = await authApis().post(endpoints['createSection'], {
                ...section,
                eventId: eventId
            });


            if (res.status === 200) {
                setCreating(false);
                setSuccessMessage('Tạo thành công');
                setDisplaySuccessSnack(true);
                setTimeout(() => {
                    setDisplaySuccessSnack(false);
                }, 2000);
                fetchSections();
                form.resetFields()
            }
        }
        catch (e) {
            setErrorMessage(e.response?.data?.message || e.message);
            setDisplayErrorDialog(true);
        }
        finally {
            setLoadingSection(false);
        }
    }


    const updateSection = async (id, value) => {
        try {
            setLoadingSection(true);
            let res = await authApis().patch(endpoints['updateSection'](id), { ...value });



            if (res.status === 200) {
                setCreating(false);
                setSuccessMessage('Cập nhật thành công');
                setDisplaySuccessSnack(true);
                setTimeout(() => {
                    setDisplaySuccessSnack(false);
                }, 2000);
                fetchSections();
                form.resetFields()
            }
        }
        catch (e) {
            setErrorMessage(e.response?.data?.message || e.message);
            setDisplayErrorDialog(true);
        }
        finally {
            setLoadingSection(false);
        }
    }


    const fetchSections = async () => {
        try {
            setLoadingSections(true);
            let url = `/sections?eventId=${eventId}`;
            let res = await authApis().get(url);
            setSections(res.data.data)
            if (res.status === 200) {
                setSuccessMessage('Xóa thành công');
                setDisplaySuccessSnack(true);
                setTimeout(() => {
                    setDisplaySuccessSnack(false);
                }, 2000);
            }
        }
        catch (e) {
            setErrorMessage(e.response?.data?.message || e.message);
            setDisplayErrorDialog(true);
        }
        finally {
            setLoadingSections(false);
        }
    }


    const deleteSection = async (id) => {
        try {
            let url = `/sections/${id}`
            let res = await authApis().delete(url);
        }
        catch (e) {
            setErrorMessage(e.response?.data?.message || e.message);
            setDisplayErrorDialog(true);
        }

    }


    useEffect(() => {
        fetchSections();
    }, [eventId]);

    return (
        <Box>
            {sections && sections.length > 0 && sections.map(s =>
                <MySection
                    section={s}
                    onClickDelete={() => {
                        deleteSection(s.id)
                    }}
                    onClickEdit={() => {
                        setCreating(true)
                        form.setFieldValue('name', s.name);
                        form.setFieldValue('price', s.price);
                        form.setFieldValue('description', s.description);
                        form.setFieldValue('totalSeats', s.totalSeats);
                        form.setFieldValue('limitTicket', s.limitTicket);
                        form.setFieldValue('color', s.color);
                        form.setFieldValue('id', s.id)
                    }}
                />
            )}
            {!creating && <AddButton onClick={() => setCreating(true)} />}


            {creating && <Divider sx={{ my: 10 }}>Tạo loại vé</Divider>}


            {creating &&
                <Form
                    form={form}
                    onFinish={(value) => {
                        if (form.getFieldValue('id') !== undefined) {
                            console.log(form.getFieldValue('id'))
                            updateSection(form.getFieldValue('id'), value);
                        }
                        else {
                            createSection(value);
                        }
                    }}
                >
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Tên hạng vé"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="name"
                        rules={[{ required: true, message: 'Tên loại vé không được để trống' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Giá"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="price"
                        rules={[{ required: true, message: 'Giá không được để trống' }]}
                    >
                        <Input type="number" />
                    </Form.Item>


                    <Form.Item
                        label="Mô tả"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="description"
                        rules={[{ required: true, message: 'Mô tả không được để trống' }]}
                    >
                        <Input.TextArea
                            style={{ height: '300px' }}
                            rows={4}
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>


                    <Form.Item label="Số ghế"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="totalSeats"
                        rules={[{ required: true, message: 'Số ghế không được để trống' }]}
                    >
                        <Input type='number' />
                    </Form.Item>


                    <Form.Item label="Giới hạn số lượng vé"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="limitTicket"
                        rules={[{ required: true, message: 'Giới hạn số lượng vé không được để trống' }]}
                    >
                        <Input type='number' />
                    </Form.Item>


                    <Form.Item label="Màu"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="color"
                        rules={[{ required: true, message: 'Màu sắc không được để trống' }]}
                    >
                        <ColorPicker onChange={(value) => {
                            form.setFieldValue("color", value.toHexString())
                        }} />
                    </Form.Item>


                    <Form.Item label="Hành động"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <SaveButton />
                            <CloseButton onClick={() => {
                                setCreating(false)
                                form.resetFields()
                            }} />
                        </div>
                    </Form.Item>
                </Form>
            }


            <ErrorDialog message={errorMessage} open={displayErrorDialog} onClose={() => setDisplayErrorDialog(false)} />

            <Snackbar
                color="success"
                size="md"
                variant="soft">
                open={displaySuccessSnack}
                {successMessage}
            </Snackbar>
        </Box>
    );
}
export default CreateSection;