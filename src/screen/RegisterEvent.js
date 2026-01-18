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
import { upload } from "@testing-library/user-event/dist/upload";

const RegisterEvent = () => {

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [genres, setGenres] = useState([]);
    const [province, setProvince] = useState();
    const [district, setDistrict] = useState();
    const [ward, setWard] = useState();

    const imageRef = useRef();
    const licenseRef = useRef();
    const [image, setImage] = useState(null);
    const [license, setLicense] = useState(null);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [openSuccessSnack, setOpenSuccessSnack] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const user = useContext(MyUserContext);

    const [form] = Form.useForm();

    const nav = useNavigate();



    const loadGenre = async () => {
        try {
            let res = await authApis().get(endpoints.getGenres);
            res.data.data && setGenres(res.data.data.map(g =>
            ({
                value: g.id,
                label: g.name,
            })
            ));
        }
        catch (e) {
            setErrorMessage("Lỗi khi tải thông tin Tỉnh/Thành phố" + e.message);
            setOpenErrorDialog(true);
        }
    }

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
        loadGenre();
    }, []);


    const validate = (event) => {
        if (event.endTime.isBefore(event.startTime)) {
            setErrorMessage("Thời gian bắt đầu phải trước thời gian kết thúc");
            setOpenErrorDialog(true)
            return false;
        }
        return true;
    };



    const register = async (event) => {

        if (validate(event)) {

            try {
                setLoading(true);
                console.log(event)
                let form = new FormData();
                form.append('name', event.name);
                form.append('genreId', event.genre);
                form.append('ageLimit', event.ageLimit);
                form.append('address', event.address);
                form.append('province', event.province);
                form.append('district', event.district);
                form.append('ward', event.ward);
                form.append('description', event.description);
                form.append('organizerId', user.organizer.id);
                form.append('date', event.date.format("YYYY-MM-DD"));
                form.append('startTime', event.startTime.format("HH:mm"))
                form.append('endTime', event.endTime.format("HH:mm"))

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
                    nav('/events');
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


    class MyUploadAdapter {
        constructor(loader) {
            this.loader = loader;
        }

        upload() {
            return this.loader.file.then(
                (file) =>
                    new Promise((resolve, reject) => {
                        const formData = new FormData();
                        formData.append("image", file);
                        authApis()
                            .post(endpoints["uploadImage"], formData, {
                                headers: { "Content-Type": "multipart/form-data" },
                            })
                            .then((res) => {
                                resolve({
                                    default: res.data.data,
                                });
                            })
                            .catch((err) => {
                                reject(err.response?.data?.message || err.message);
                            });
                    })
            );
        }
        abort() { }
    }

    function MyCustomUploadAdapterPlugin(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
            return new MyUploadAdapter(loader);
        };
    }


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

                <Form style={{ width: '100%' }}
                    onFinish={register}
                    form={form}>

                    <Form.Item
                        label="Tên sự kiện"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="name"
                        rules={[{ required: true, message: 'Tên không được để trống' }]}>
                        <Input />
                    </Form.Item>



                    <Form.Item
                        label="Thể loại"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="genre"
                        rules={[{ required: true, message: 'Thể loại không được để trống' }]}
                    >
                        <Select
                            style={{ width: 300 }}
                            options={genres}
                        />
                    </Form.Item>




                    <Form.Item label="Ngày tổ chức"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="date"
                        rules={[{ required: true, message: 'Ngày tổ chức không được để trống' }]}
                    >
                        <DatePicker />
                    </Form.Item>

                    <Form.Item label="Thời gian bắt đầu"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="startTime"
                        rules={[{ required: true, message: 'Thời gian bắt đầu không được để trống' }]}
                    >
                        <TimePicker />
                    </Form.Item>


                    <Form.Item label="Thời gian kết thúc"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="endTime"
                        rules={[{ required: true, message: 'Thời gian kết thúc không được để trống' }]}
                    >
                        <TimePicker />
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

                    <Form.Item label="Mô tả sự kiện"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="description"
                        rules={[{ required: true, message: 'Mô tả không được để trống' }]}>
                        <CKEditor
                            editor={ClassicEditor}
                            config={{
                                extraPlugins: [MyCustomUploadAdapterPlugin], 
                                toolbar: [
                                    "heading", "|", "bold", "italic", "link", "bulletedList",
                                    "numberedList", "blockQuote", "uploadImage", "insertTable", "undo", "redo",
                                ],
                            }}
                            onChange={(e, editor) => {
                                form.setFieldValue("description", editor.getData());
                            }}
                        />
                    </Form.Item>


                    <Form.Item label="Độ tuối giới hạn"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="ageLimit"
                        rules={[{ required: true, message: 'Độ tuổi giới hạn không được để trống' }]}>
                        <Input type="number" />
                    </Form.Item>


                    <Form.Item label="Hình ảnh"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="image"
                        rules={[{ required: true, message: 'Hình ảnh không được để trống' }]}
                    >
                        <Stack direction='column'>
                            <input
                                type="file"
                                accept="image/*"
                                ref={imageRef}
                                onChange={() => {
                                    setImage(imageRef.current.files[0])
                                    form.setFieldValue("image", imageRef.current.files[0])
                                }}
                                hidden
                            />
                            <Image
                                width='50%'
                                src={image ? URL.createObjectURL(imageRef.current.files[0]) : ''}
                            />
                            <AntButton style={{ width: 200 }} onClick={() => imageRef.current.click()} icon={<UploadOutlined />}>Tải lên hình ảnh</AntButton>

                        </Stack>
                    </Form.Item>



                    <Form.Item label="Giấy phép tổ chức sự kiện"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="license"
                        rules={[{ required: true, message: 'Giấy phép không được để trống' }]}
                    >
                        <Stack direction='column'>
                            <input
                                type="file"
                                accept="application/pdf"
                                ref={licenseRef}
                                onChange={() => {
                                    setLicense(licenseRef.current.files[0])
                                    form.setFieldValue("license", licenseRef.current.files[0]);
                                }}
                                hidden
                            />
                            {license && (
                                <iframe title="Giấy phép tổ chức sự kiện"
                                    src={URL.createObjectURL(license)}
                                    width="50%"
                                    height="500px"
                                    style={{ border: '1px solid #ccc', marginTop: 10 }}
                                />
                            )}

                            <AntButton style={{ width: 300 }} onClick={() => licenseRef.current.click()} icon={<UploadOutlined />}>Tải lên Giấy phép tổ chức sự kiện</AntButton>

                        </Stack>
                    </Form.Item>

                    <Form.Item label="Hành động"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <AntButton type="primary" htmlType="submit" sx={{ mt: 2, width: "50%" }} loading={loading} >Đăng Ký</AntButton>
                    </Form.Item>


                </Form>
            </Stack>

            <ErrorDialog message={errorMessage} open={openErrorDialog} onClose={() => setOpenErrorDialog(false)} />
            <MySnackBar message={successMessage} open={openSuccessSnack} />
        </Box>
    );
};

export default RegisterEvent;
