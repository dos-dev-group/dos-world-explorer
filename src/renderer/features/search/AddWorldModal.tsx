import { Flex, FlexRow } from '@src/renderer/components/styledComponents';
import { URL_REGEX } from '@src/renderer/utils/constants';
import { autoFileToMain } from '@src/renderer/utils/ipc/editSheetToMain';
import { spacing } from '@src/renderer/utils/styling';
import { World, WorldEditInput, WorldEditOutput } from '@src/types';
import {
  Button,
  Col,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  onOk?: (e: WorldEditInput) => void;
  onCancel?: () => void;
  visible: boolean;
  types: string[];
}
function AddWorldModal(props: Props) {
  const [curType, setCurType] = useState<string>();
  const [curUrl, setCurUrl] = useState<string>();
  const [curDesc, setCurDesc] = useState<string>();
  const [curTags, setCurTags] = useState<string[]>([]);
  const [curScore, setCurScore] = useState<number>();
  const [inputTag, setInputTag] = useState<string>('');
  const [worldCheckInfo, setWorldCheckInfo] = useState<WorldEditOutput>();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (props.visible === false) {
      setCurType(undefined);
      setCurUrl(undefined);
      setCurDesc(undefined);
      setCurTags([]);
      setCurScore(undefined);
      setInputTag('');
      setWorldCheckInfo(undefined);
    }
  }, [props.visible]);

  const renderedOptions = props.types
    .filter((e) => e !== '전체')
    .map((e) => <Select.Option key={e}>{e}</Select.Option>);

  return (
    <Modal
      title="Add World"
      onOk={() => {
        props.onOk?.({
          description: curDesc || '',
          type: curType || '',
          score: curScore!,
          tags: curTags,
          url: curUrl!,
        });
        props.onCancel?.();
      }}
      destroyOnClose
      onCancel={props.onCancel}
      visible={props.visible}
      width="80%"
      okButtonProps={{
        disabled:
          !URL_REGEX.test(curUrl || '') || worldCheckInfo === undefined
            ? true
            : false,
      }}
    >
      <Typography.Title level={5}>타입</Typography.Title>
      <Select
        css={{
          width: 200,
        }}
        onSelect={(e: string) => setCurType(e)}
      >
        {renderedOptions}
      </Select>
      <Input.Group css={{ marginTop: spacing(1) }}>
        <Typography.Title level={5}>URL</Typography.Title>
        <Input
          css={{ width: 'calc(100% - 200px)' }}
          onChange={(e) => {
            setCurUrl(e.target.value);
            setWorldCheckInfo(undefined);
          }}
        />
        <Button
          type="primary"
          loading={isChecking}
          disabled={!URL_REGEX.test(curUrl || '')}
          onClick={() => {
            setIsChecking(true);
            autoFileToMain(curUrl!).then((info) => {
              console.log('autoFileToMain');
              setWorldCheckInfo(info);
              setIsChecking(false);
            });
          }}
        >
          Check
        </Button>
      </Input.Group>
      <Input.Group css={{ marginTop: spacing(1) }}>
        <Space size="small" direction="vertical">
          <Row gutter={8}>
            <Image src={worldCheckInfo?.imageUrl} />
          </Row>
          <Row gutter={8}>
            <Col span={12}>
              <Input disabled value={worldCheckInfo?.name} addonBefore="Name" />
            </Col>
            <Col span={12}>
              <Input
                disabled
                value={worldCheckInfo?.author}
                addonBefore="Author"
              />
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24}>
              <Input
                disabled
                value={worldCheckInfo?.key}
                addonBefore="World Key"
              />
            </Col>
          </Row>
        </Space>
      </Input.Group>

      <Input.Group css={{ marginTop: spacing(1) }}>
        <Typography.Title level={5}>별점</Typography.Title>
        <InputNumber
          css={{
            width: 200,
          }}
          max={6}
          min={1}
          defaultValue={1}
          onChange={(v) => setCurScore(v)}
        />
      </Input.Group>
      <Input.Group css={{ marginTop: spacing(1), width: 'calc(100% - 200px)' }}>
        <Typography.Title level={5}>설명</Typography.Title>
        <Input onChange={(e) => setCurDesc(e.target.value)} />
      </Input.Group>
      <div css={{ marginTop: spacing(1), width: 'calc(100% - 200px)' }}>
        <Typography.Title level={5}>태그</Typography.Title>
        {curTags.map((tag) => (
          <Tag
            key={tag}
            onClose={() => {
              const newTags = curTags.filter((e) => tag !== e);
              setCurTags(newTags);
            }}
            closable
          >
            {tag}
          </Tag>
        ))}
        <Input
          type="text"
          size="small"
          css={{
            width: 78,
            marginRight: 8,
            verticalAlign: 'top',
          }}
          value={inputTag}
          onChange={(e) => setInputTag(e.target.value)}
          onBlur={(e) => {
            if (inputTag && curTags.indexOf(inputTag) === -1) {
              setCurTags([...curTags, inputTag]);
            }
            setInputTag('');
          }}
          onPressEnter={(e) => {
            if (inputTag && curTags.indexOf(inputTag) === -1) {
              setCurTags([...curTags, inputTag]);
            }
            setInputTag('');
          }}
        />
      </div>
    </Modal>
  );
}
export default AddWorldModal;

type WorldModalData = Omit<World, keyof WorldEditOutput> &
  Partial<WorldEditOutput>;