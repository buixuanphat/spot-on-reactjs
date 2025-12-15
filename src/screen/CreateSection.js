import { Box, Button, Chip, ChipDelete, Snackbar } from "@mui/joy";
import { ColorPicker, Form, Input } from "antd";
import { useEffect, useState } from "react";
import ErrorDialog from "../components/ErrorDialog";
import { authApis, endpoints } from "../configs/Apis";

const CreateSection = ({ eventId }) => {

    const [sections, setSections] = useState([]);

    const [section, setSection] = useState({});

    const [displayErrorDialog, setDisplayErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [displaySuccessSnack, setDisplaySuccessSnack] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [loadingSections, setLoadingSections] = useState(false);
    const [loadingSection, setLoadingSection] = useState(false);

    const [creating, setCreating] = useState(false);

    const createSection = async () => {
        try {
            setLoadingSection(true);
            let res = await authApis().post(endpoints['createSection'], {
                ...section,
                eventId: eventId
            });


            if (res.status === 200) {
                setSuccessMessage('Tạo thành công');
                setDisplaySuccessSnack(true);
                setTimeout(() => {
                    setDisplaySuccessSnack(false);
                }, 2000);
                fetchSections();
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
                fetchSections();
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
        let url = `/sections/${id}`
        let res = await authApis().delete(url);
    }


    useEffect(() => {
        fetchSections();
    }, [eventId]);

    return (
        <Box>
            <h1>Loại vé</h1>
            {sections && sections.length > 0 && sections.map(s => <Chip
                key={s.id}
                size="lg"
                variant="solid"
                sx={{ backgroundColor: s.color }}
                endDecorator={<ChipDelete onDelete={() => deleteSection(s.id)} />}
            >
                {s.name}
            </Chip>)}
            <Button onClick={() => setCreating(true)} >Thêm</Button>
            {creating &&
                <Form>
                    <Form.Item label="Tên hạng vé"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}>
                        <Input width='50%' value={section.name} type="text" onChange={(e) => setSection({ ...section, name: e.target.value })} />
                    </Form.Item>

                    <Form.Item label="Giá"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}>
                        <Input width='50%' value={section.price} type="number" onChange={(e) => setSection({ ...section, price: e.target.value })} />
                    </Form.Item>


                    <Form.Item label="Mô tả"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}>
                        <Input width='50%' value={section.description} type="text" onChange={(e) => setSection({ ...section, description: e.target.value })} />
                    </Form.Item>


                    <Form.Item label="Số ghế"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}>
                        <Input width='50%' value={section.totalSeats} type='number' onChange={(e) => setSection({ ...section, totalSeats: e.target.value })} />
                    </Form.Item>


                    <Form.Item label="Giới hạn số lượng vé"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}>
                        <Input width='50%' value={section.limitTicket} type='number' onChange={(e) => setSection({ ...section, limitTicket: e.target.value })} />
                    </Form.Item>


                    <Form.Item label="Màu"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}>
                        <ColorPicker defaultValue="grey" value={section.color} onChange={(value) => {
                            setSection({ ...section, color: value.toHexString() })
                        }} />
                    </Form.Item>

                    <Button onClick={() => createSection()} >
                        Lưu
                    </Button>
                    <Button onClick={() => setCreating(false)} >Hủy</Button>


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