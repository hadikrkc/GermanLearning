import React, { useState } from 'react';
import { Card, Row, Col, Form, Input, Button, message, Result } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authApi } from 'api/auth';

const backgroundStyle = {
  backgroundImage: 'url(/img/others/img-17.jpg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
};

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const onSend = async (values) => {
    setLoading(true);
    try {
      await authApi.forgotPassword(values.email);
      setSent(true);
    } catch {
      message.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="h-100" style={backgroundStyle}>
        <div className="container d-flex flex-column justify-content-center h-100">
          <Row justify="center">
            <Col xs={20} sm={20} md={20} lg={9}>
              <Card>
                <Result
                  status="success"
                  title="Email sent!"
                  subTitle="Check your inbox for the password reset link."
                  extra={
                    <Button type="primary" onClick={() => navigate('/auth/login')}>
                      Back to Login
                    </Button>
                  }
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  return (
    <div className="h-100" style={backgroundStyle}>
      <div className="container d-flex flex-column justify-content-center h-100">
        <Row justify="center">
          <Col xs={20} sm={20} md={20} lg={9}>
            <Card>
              <div className="my-2">
                <div className="text-center">
                  <h3 className="mt-3 font-weight-bold">Forgot Password?</h3>
                  <p className="mb-4">Enter your Email to reset password</p>
                </div>
                <Row justify="center">
                  <Col xs={24} sm={24} md={20} lg={20}>
                    <Form form={form} layout="vertical" name="forget-password" onFinish={onSend}>
                      <Form.Item
                        name="email"
                        rules={[
                          { required: true, message: 'Please input your email address' },
                          { type: 'email', message: 'Please enter a valid email!' },
                        ]}
                      >
                        <Input
                          placeholder="Email Address"
                          prefix={<MailOutlined className="text-primary" />}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button loading={loading} type="primary" htmlType="submit" block>
                          {loading ? 'Sending...' : 'Send Reset Email'}
                        </Button>
                      </Form.Item>
                      <div className="text-center">
                        <a href="/auth/login">Back to login</a>
                      </div>
                    </Form>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ForgotPassword;
