import { Flex, FlexRow } from '@src/renderer/components/styledComponents';
import { URL_REGEX } from '@src/renderer/utils/constants';
import { autoFileToMain } from '@src/renderer/utils/ipc/editSheetToMain';
import simpleStringHash from '@src/renderer/utils/simpleStringHash';
import { spacing } from '@src/renderer/utils/styling';
import {
  World,
  WorldEditInput,
  WorldEditOutput,
  WorldPartialNonVrcInfo,
} from '@src/types';
import {
  Button,
  Col,
  Image,
  Input,
  InputNumber,
  Modal,
  Rate,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import { PresetColorTypes } from 'antd/lib/_util/colors';
import { useEffect, useState } from 'react';

interface Props {
  onEdit?: (key: string, e: WorldEditInput) => void;
  onCancel?: () => void;
  types: string[];
  world?: WorldPartialNonVrcInfo;
}
function EditWorldModal(props: Props) {
  const [curType, setCurType] = useState<string>();
  const [curUrl, setCurUrl] = useState<string>();
  const [curDesc, setCurDesc] = useState<string>();
  const [curTags, setCurTags] = useState<string[]>([]);
  const [curScore, setCurScore] = useState<number>(1);
  const [inputTag, setInputTag] = useState<string>('');
  const [worldCheckInfo, setWorldCheckInfo] = useState<WorldEditOutput>();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (props.world === undefined) {
      setCurType(undefined);
      setCurUrl(undefined);
      setCurDesc(undefined);
      setCurTags([]);
      setCurScore(1);
      setInputTag('');
      setWorldCheckInfo(undefined);
    } else {
      setCurType(props.world.type);
      setCurUrl(props.world.url);
      setCurDesc(props.world.description);
      setCurTags(props.world.tags || []);
      setCurScore(props.world.score || 1);
      setWorldCheckInfo({
        author: props.world.author,
        date: props.world.date || new Date(),
        key: props.world.key,
        name: props.world.name,
        imageUrl: props.world.imageUrl,
      });
    }
  }, [props.world]);

  const renderedOptions = props.types
    .filter((e) => e !== '전체')
    .map((e) => <Select.Option key={e}>{e}</Select.Option>);

  return (
    <Modal
      title="시트 월드정보 변경하기"
      onOk={() => {
        props.onEdit?.(props.world?.key || '', {
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
      visible={props.world ? true : false}
      width="80%"
      okButtonProps={{
        disabled:
          !URL_REGEX.test(curUrl || '') ||
          worldCheckInfo === undefined ||
          curType === undefined
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
        value={curType}
        status={curType === undefined ? 'error' : undefined}
      >
        {renderedOptions}
      </Select>
      <Input.Group css={{ marginTop: spacing(1) }}>
        <Typography.Title level={5}>URL</Typography.Title>
        <FlexRow css={{ width: 'calc(100% - 200px)' }}>
          <Input
            css={{ flex: 1 }}
            onChange={(e) => {
              setCurUrl(e.target.value);
              setWorldCheckInfo(undefined);
            }}
          />
          <Button
            css={{ marginLeft: spacing(1) }}
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
        </FlexRow>
      </Input.Group>
      <Input.Group css={{ marginTop: spacing(1) }}>
        <Space size="small" direction="vertical">
          <Row gutter={8}>
            <Image src={worldCheckInfo?.imageUrl} />
          </Row>
          <Row gutter={8}>
            <Col span={12}>
              <Input disabled value={worldCheckInfo?.name} addonBefore="이름" />
            </Col>
            <Col span={12}>
              <Input
                disabled
                value={worldCheckInfo?.author}
                addonBefore="제작자"
              />
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24}>
              <Input
                disabled
                value={worldCheckInfo?.key}
                addonBefore="월드 ID"
              />
            </Col>
          </Row>
        </Space>
      </Input.Group>

      <Input.Group css={{ marginTop: spacing(1) }}>
        <Typography.Title level={5}>별점</Typography.Title>
        <Rate
          allowClear={false}
          count={6}
          value={curScore}
          onChange={(n) => setCurScore(n)}
        />
      </Input.Group>
      <Input.Group css={{ marginTop: spacing(1), width: 'calc(100% - 200px)' }}>
        <Typography.Title level={5}>설명</Typography.Title>
        <Input onChange={(e) => setCurDesc(e.target.value)} value={curDesc} />
      </Input.Group>
      <div css={{ marginTop: spacing(1), width: 'calc(100% - 200px)' }}>
        <Typography.Title level={5}>태그</Typography.Title>
        {curTags.map((tag) => {
          const colorIndex = simpleStringHash(tag) % PresetColorTypes.length;
          const color = PresetColorTypes[colorIndex];

          return (
            <Tag
              color={color}
              key={tag}
              onClose={() => {
                const newTags = curTags.filter((e) => tag !== e);
                setCurTags(newTags);
              }}
              closable
            >
              {tag}
            </Tag>
          );
        })}
        <Input
          type="text"
          size="small"
          css={{
            width: 78,
            marginRight: 8,
            verticalAlign: 'top',
          }}
          value={inputTag}
          onChange={(e) => setInputTag(e.target.value.trim())}
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
export default EditWorldModal;
