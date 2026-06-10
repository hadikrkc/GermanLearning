import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Card, Col, Row, Tag, Spin, Typography, Space, message } from 'antd';
import { contentApi, userApi } from 'api/auth';

const { Title, Text, Paragraph } = Typography;

const Onboarding = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [step, setStep] = useState(1);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedSubLevels, setSelectedSubLevels] = useState([]);
  const [primaryId, setPrimaryId] = useState(null);

  useEffect(() => {
    if (step === 2) {
      setLoading(true);
      contentApi
        .getLevels()
        .then(setLevels)
        .catch(() => message.error('Failed to load levels'))
        .finally(() => setLoading(false));
    }
  }, [step]);

  const toggleSubLevel = (id) => {
    setSelectedSubLevels((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    if (primaryId === id) setPrimaryId(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await userApi.setLevels({ subLevelIds: selectedSubLevels, primarySubLevelId: primaryId });
      setStep(3);
    } catch {
      message.error('Failed to save levels. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (step === 1) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card style={{ width: 420, textAlign: 'center' }}>
          <Title level={2} style={{ fontSize: 48, marginBottom: 8 }}>
            🇩🇪
          </Title>
          <Title level={3}>Welcome, {user?.displayName ?? 'Learner'}!</Title>
          <Paragraph type="secondary">
            Let's personalise your German learning journey in just a few steps.
          </Paragraph>
          <Button type="primary" size="large" block onClick={() => setStep(2)}>
            Get Started →
          </Button>
        </Card>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card style={{ width: 420, textAlign: 'center' }}>
          <Title level={2} style={{ fontSize: 48, marginBottom: 8 }}>
            ✅
          </Title>
          <Title level={3}>All set!</Title>
          <Paragraph type="secondary">
            Your levels have been saved. You're ready to start learning.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            block
            onClick={() => navigate('/app/dashboard', { replace: true })}
          >
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Card style={{ width: 520 }}>
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Select Your Level
          </Title>
          <Text type="secondary">Step 2 / 2</Text>
        </div>
        <Paragraph type="secondary">
          Choose your German level. You can select more than one.
        </Paragraph>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <Spin />
          </div>
        ) : (
          <div style={{ maxHeight: 380, overflowY: 'auto', paddingRight: 4 }}>
            {levels.map((level) => (
              <div key={level.id} style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {level.displayName}
                </Text>
                <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
                  {level.subLevels.map((sl) => {
                    const selected = selectedSubLevels.includes(sl.id);
                    const isPrimary = primaryId === sl.id;
                    return (
                      <Col xs={12} key={sl.id}>
                        <Card
                          size="small"
                          hoverable
                          onClick={() => toggleSubLevel(sl.id)}
                          style={{
                            border: selected ? '2px solid #3e82f7' : '1px solid #d9d9d9',
                            background: selected ? '#e6f4ff' : '#fff',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{sl.code}</div>
                          <div style={{ fontSize: 12, color: '#999', marginBottom: selected ? 6 : 0 }}>
                            {sl.displayName}
                          </div>
                          {selected && (
                            <Tag
                              color={isPrimary ? 'blue' : 'default'}
                              style={{ cursor: 'pointer', fontSize: 11 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setPrimaryId(isPrimary ? null : sl.id);
                              }}
                            >
                              {isPrimary ? '★ Primary' : 'Set as primary'}
                            </Tag>
                          )}
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            ))}
          </div>
        )}

        <Space style={{ width: '100%', marginTop: 16 }} size={12}>
          <Button
            block
            onClick={() => navigate('/app/dashboard', { replace: true })}
            style={{ flex: 1 }}
          >
            Skip
          </Button>
          <Button
            type="primary"
            block
            onClick={handleSave}
            loading={saving}
            disabled={selectedSubLevels.length === 0}
            style={{ flex: 1 }}
          >
            Save
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Onboarding;
