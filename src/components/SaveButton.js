import { CheckCircleFilled } from "@ant-design/icons"
import { Button } from "antd"

const SaveButton = ({ onClick, style, loading }) => {
    return (
        <Button htmlType="submit" loading={loading} icon={<CheckCircleFilled />} variant="solid" color="primary" onClick={onClick} style={style} >Lưu</Button>
    )
}
export default SaveButton