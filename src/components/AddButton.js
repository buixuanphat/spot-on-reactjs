import AddIcon from '@mui/icons-material/Add';
import { Button } from 'antd';

const AddButton = ({ onClick }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }} >
            <Button variant="solid" color="primary" style={{ justifySelf: 'center', marginTop: 10 }} icon={<AddIcon />} onClick={onClick}>Thêm</Button>
        </div>
    )
}
export default AddButton