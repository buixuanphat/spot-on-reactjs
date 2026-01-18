import { Typography } from "@mui/joy";
import DeleteButton from "./DeleteButton";
import EdittButton from "./EditButton";
import { MyColor } from "../configs/Enum";

const MySection = ({ section, onClickEdit, onClickDelete }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            margin: '10px',
        }}>

            <div style={{
                display: 'flex',
                position: 'relative',
                background: '#fff',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0',
                width: '750px',
                minHeight: '200px'
            }}>
                <div style={{ flex: 3, padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <Typography level="body-xs" sx={{ opacity: 0.6, letterSpacing: '0.15rem', fontWeight: 800, color: '#666' }}>
                            LOẠI VÉ
                        </Typography>

                        <Typography level="h4" sx={{ mb: 1, color: '#1A1A1A', fontWeight: 800, fontSize: '1.6rem' }}>
                            {section.name.toUpperCase()}
                        </Typography>

                        <Typography
                            level="h2"
                            sx={{
                                color: MyColor.redError || '#e63946',
                                fontWeight: 'bold',
                                fontFamily: 'monospace',
                                fontSize: '2rem',
                                my: 1
                            }}
                        >
                            {section.price.toLocaleString("vi-VN")} <span style={{ fontSize: 16, fontWeight: 400 }}>VNĐ</span>
                        </Typography>

                        <Typography level="body-sm" sx={{ opacity: 0.7, mb: 2, lineHeight: 1.5, color: '#444' }}>
                            {section.description || "Không có mô tả cho loại vé này."}
                        </Typography>
                    </div>

                    <div style={{
                        display: "flex",
                        gap: 30,
                        paddingTop: 15,
                        borderTop: '2px dashed #f5f5f5'
                    }}>
                        <div>
                            <Typography level="body-xs" sx={{ opacity: 0.5, fontWeight: 'bold' }}>CÒN LẠI</Typography>
                            <Typography level="body-md" sx={{ fontWeight: 'bold', color: '#333' }}>{section.totalSeats} vé</Typography>
                        </div>
                        <div>
                            <Typography level="body-xs" sx={{ opacity: 0.5, fontWeight: 'bold' }}>GIỚI HẠN</Typography>
                            <Typography level="body-md" sx={{ fontWeight: 'bold', color: '#333' }}>{section.limitTicket} vé/người</Typography>
                        </div>
                    </div>
                </div>


                <div style={{
                    position: 'relative',
                    width: '30px',
                    backgroundColor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>

                    <div style={{
                        position: 'absolute', top: '-15px', width: '30px', height: '30px',
                        borderRadius: '50%', background: '#f0f2f5', boxShadow: 'inset 0 -5px 5px rgba(0,0,0,0.05)'
                    }} />


                    <div style={{ height: '100%', width: '0px', borderLeft: '2px dashed #ddd' }} />


                    <div style={{
                        position: 'absolute', bottom: '-15px', width: '30px', height: '30px',
                        borderRadius: '50%', background: '#f0f2f5', boxShadow: 'inset 0 5px 5px rgba(0,0,0,0.05)'
                    }} />
                </div>


                <div style={{
                    flex: 1,
                    backgroundColor: section.color,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: "center",
                    justifyContent: "center",
                    padding: '20px',
                    borderLeft: '1px solid rgba(0,0,0,0.05)'
                }}>

                </div>
            </div>
            <div style={{ display: 'flex', margin: '10px', gap: '10px', flexDirection: 'column' }}>
                <DeleteButton onClick={onClickDelete} />
                <EdittButton onClick={onClickEdit} />
            </div>
        </div>
    )
}
export default MySection