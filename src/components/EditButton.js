import { CheckCircleFilled, EditFilled } from "@ant-design/icons"
import { Button } from "antd"

const EdittButton = ({ onClick, style, loading }) => {
    return (
        <Button loading={loading} icon={<EditFilled />} variant="solid" color="orange" onClick={onClick} style={style} >Chỉnh sửa</Button>
    )
}
export default EdittButton